import { Op } from 'sequelize';

class Paginator {
    constructor(query = {}) {
        this.page = Number.isFinite(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
        this.limit = Number.isFinite(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;

        this.sortBy = query.sortBy || 'created_at';
        this.sortOrder = (String(query.sortOrder || '').toLowerCase() === 'desc') ? 'DESC' : 'ASC';

        this.allowedSort = [];
        this.allowedFilters = [];
        this.query = query;

        // global filter mode: 'and' (default) or 'or'
        this.filterMode = (String(query.filterMode || '').toLowerCase() === 'or') ? 'or' : 'and';

        this.where = {};
    }

    allowSort(fields = []) {
        this.allowedSort = fields;
        return this;
    }

    allowFilter(fields = []) {
        this.allowedFilters = fields;
        return this;
    }

    validateSort() {
        if (this.allowedSort.length > 0 && !this.allowedSort.includes(this.sortBy)) {
            this.sortBy = this.allowedSort[0];
        }
    }

    /**
     * Build an array of simple conditions, then combine them using Op.and / Op.or
     * Supported behaviors:
     *  - `name` => LIKE '%value%'
     *  - numeric-like fields (strings that parse to number) => Number(value)
     *  - other fields => exact match
     */
    buildFilters() {
        const conditions = [];

        for (const field of this.allowedFilters) {
            if (this.query[field] === undefined) continue;
            const raw = this.query[field];

            // skip empty strings
            if (typeof raw === 'string' && raw.trim() === '') continue;

            // Special case: name -> LIKE
            if (field === 'name') {
                const val = String(raw).trim();
                if (val !== '') {
                    conditions.push({ [field]: { [Op.like]: `%${val}%` } });
                }
                continue;
            }

            // Numeric detection: if the value is a string that represents a finite number, convert
            if (typeof raw === 'string' && raw !== '' && !Number.isNaN(Number(raw))) {
                conditions.push({ [field]: Number(raw) });
                continue;
            }

            // Non-string numbers or booleans
            conditions.push({ [field]: raw });
        }

    if (conditions.length === 0) {
        this.where = {};
        return;
    }

    if (this.filterMode === 'or') {
        this.where = { [Op.or]: conditions };
    } else {
            this.where = { [Op.and]: conditions };
    }
    }

    build() {
        this.validateSort();
        this.buildFilters();

        const offset = (this.page - 1) * this.limit;

        return {
            limit: this.limit,
            offset,
            order: [[this.sortBy, this.sortOrder]],
            where: this.where,
            // expose metadata expected by sendPaginatedResponse
            page: this.page,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            filterMode: this.filterMode
        };
    }
}

export default Paginator;
