import React, { useState, useEffect, useRef } from "react";
import { CreditCard, Lock } from "lucide-react";

export default function CreditCardForm({
  onCardDataChange,
  onValidationChange,
}) {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    month: "",
    year: "",
    cvv: "",
  });

  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [focusElement, setFocusElement] = useState(null);
  const [cardType, setCardType] = useState("visa");
  const [errors, setErrors] = useState({});

  const cardNumberRef = useRef(null);
  const cardNameRef = useRef(null);
  const cardDateRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Detectar tipo de tarjeta
  useEffect(() => {
    const number = cardData.number.replace(/\s/g, "");
    if (/^4/.test(number)) setCardType("visa");
    else if (/^5[1-5]/.test(number)) setCardType("mastercard");
    else if (/^3[47]/.test(number)) setCardType("amex");
    else setCardType("visa");
  }, [cardData.number]);

  // Validar tarjeta
  useEffect(() => {
    const newErrors = {};
    const number = cardData.number.replace(/\s/g, "");

    if (number && number.length < 13) {
      newErrors.number = "Número de tarjeta inválido";
    }

    if (cardData.name && cardData.name.length < 3) {
      newErrors.name = "Nombre muy corto";
    }

    if (cardData.cvv && cardData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido";
    }

    setErrors(newErrors);

    // Validar si está completo
    const isValid =
      number.length >= 13 &&
      cardData.name.length >= 3 &&
      cardData.month &&
      cardData.year &&
      cardData.cvv.length >= 3;

    onValidationChange?.(isValid);
    onCardDataChange?.(cardData);
  }, [cardData, onCardDataChange, onValidationChange]);

  const handleInputChange = (field, value) => {
    let processedValue = value;

    if (field === "number") {
      processedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .substring(0, 19);
    } else if (field === "name") {
      processedValue = value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
    } else if (field === "cvv") {
      processedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setCardData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const getCardMask = () => {
    return cardType === "amex" ? "#### ###### #####" : "#### #### #### ####";
  };

  const getCardNumberDisplay = () => {
    const mask = getCardMask();
    let result = "";
    let valueIndex = 0;
    const cleanNumber = cardData.number.replace(/\s/g, "");

    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === "#") {
        result += cleanNumber[valueIndex] || "#";
        valueIndex++;
      } else {
        result += mask[i];
      }
    }

    return result.split(" ");
  };

  const minMonth = cardData.year === currentYear.toString() ? currentMonth : 1;

  return (
    <div className="w-full">
      {/* Tarjeta de crédito animada */}
      <div
        className="relative mb-8 mx-auto"
        style={{ maxWidth: "430px", height: "270px" }}
      >
        <div
          className={`absolute w-full h-full transition-all duration-600 ${
            isCardFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Frente de la tarjeta */}
          <div
            className="absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {/* Efecto de brillo */}
            {focusElement && (
              <div
                className="absolute border-2 border-white/65 rounded-lg transition-all duration-300 pointer-events-none"
                style={{
                  width: focusElement.width,
                  height: focusElement.height,
                  transform: `translateX(${focusElement.x}px) translateY(${focusElement.y}px)`,
                  backdropFilter: "brightness(1.2)",
                }}
              />
            )}

            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              {/* Chip y logo */}
              <div className="flex justify-between items-start">
                <img
                  src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
                  alt="chip"
                  className="w-12 h-10"
                />
                <div className="w-16 h-12 flex items-center justify-end">
                  {cardType && (
                    <img
                      src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cardType}.png`}
                      alt={cardType}
                      className="h-full object-contain"
                    />
                  )}
                </div>
              </div>

              {/* Número de tarjeta */}
              <div
                ref={cardNumberRef}
                className="font-mono text-2xl tracking-wider mb-6 flex gap-2"
              >
                {getCardNumberDisplay().map((group, idx) => (
                  <span key={idx}>{group}</span>
                ))}
              </div>

              {/* Nombre y fecha */}
              <div className="flex justify-between items-end">
                <div ref={cardNameRef} className="flex-1 min-w-0">
                  <div className="text-xs opacity-70 mb-1">Card Holder</div>
                  <div className="font-semibold truncate">
                    {cardData.name || "FULL NAME"}
                  </div>
                </div>
                <div ref={cardDateRef} className="text-right ml-4">
                  <div className="text-xs opacity-70 mb-1">Expires</div>
                  <div className="font-semibold">
                    {cardData.month || "MM"} /{" "}
                    {cardData.year ? cardData.year.slice(-2) : "YY"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reverso de la tarjeta */}
          <div
            className="absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden [transform:rotateY(180deg)]"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="w-full h-12 bg-black mt-6"></div>
            <div className="px-6 mt-6">
              <div className="bg-white h-10 rounded flex items-center justify-end px-4">
                <span className="font-mono tracking-widest">
                  {cardData.cvv ? "•".repeat(cardData.cvv.length) : ""}
                </span>
              </div>
              <div className="text-white text-xs mt-2 opacity-80">CVV</div>
              <div className="flex justify-end mt-4">
                {cardType && (
                  <img
                    src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cardType}.png`}
                    alt={cardType}
                    className="h-8 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advertencia de seguridad */}
      <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              Transacciones 100% seguras y protegidas
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
              No almacenamos tu información de tarjeta. Todos los datos se
              procesan de forma segura y encriptada.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="space-y-4">
        {/* Número de tarjeta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número de tarjeta
          </label>
          <input
            type="text"
            value={cardData.number}
            onChange={(e) => handleInputChange("number", e.target.value)}
            onFocus={() =>
              setFocusElement({
                x: cardNumberRef.current?.offsetLeft || 0,
                y: cardNumberRef.current?.offsetTop || 0,
                width: cardNumberRef.current?.offsetWidth || 0,
                height: cardNumberRef.current?.offsetHeight || 0,
              })
            }
            onBlur={() => setTimeout(() => setFocusElement(null), 300)}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-4 py-3 border ${
              errors.number
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors`}
          />
          {errors.number && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {errors.number}
            </p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre del titular
          </label>
          <input
            type="text"
            value={cardData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onFocus={() =>
              setFocusElement({
                x: cardNameRef.current?.offsetLeft || 0,
                y: cardNameRef.current?.offsetTop || 0,
                width: cardNameRef.current?.offsetWidth || 0,
                height: cardNameRef.current?.offsetHeight || 0,
              })
            }
            onBlur={() => setTimeout(() => setFocusElement(null), 300)}
            placeholder="NOMBRE COMPLETO"
            className={`w-full px-4 py-3 border ${
              errors.name
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors uppercase`}
          />
          {errors.name && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Fecha de expiración y CVV */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mes
            </label>
            <select
              value={cardData.month}
              onChange={(e) => handleInputChange("month", e.target.value)}
              onFocus={() =>
                setFocusElement({
                  x: cardDateRef.current?.offsetLeft || 0,
                  y: cardDateRef.current?.offsetTop || 0,
                  width: cardDateRef.current?.offsetWidth || 0,
                  height: cardDateRef.current?.offsetHeight || 0,
                })
              }
              onBlur={() => setTimeout(() => setFocusElement(null), 300)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
            >
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const month = m.toString().padStart(2, "0");
                const disabled =
                  cardData.year === currentYear.toString() && m < minMonth;
                return (
                  <option key={m} value={month} disabled={disabled}>
                    {month}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Año
            </label>
            <select
              value={cardData.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
              onFocus={() =>
                setFocusElement({
                  x: cardDateRef.current?.offsetLeft || 0,
                  y: cardDateRef.current?.offsetTop || 0,
                  width: cardDateRef.current?.offsetWidth || 0,
                  height: cardDateRef.current?.offsetHeight || 0,
                })
              }
              onBlur={() => setTimeout(() => setFocusElement(null), 300)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
            >
              <option value="">YYYY</option>
              {Array.from({ length: 12 }, (_, i) => currentYear + i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CVV
            </label>
            <input
              type="text"
              value={cardData.cvv}
              onChange={(e) => handleInputChange("cvv", e.target.value)}
              onFocus={() => setIsCardFlipped(true)}
              onBlur={() => setIsCardFlipped(false)}
              placeholder="123"
              maxLength="4"
              className={`w-full px-4 py-3 border ${
                errors.cvv
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors`}
            />
            {errors.cvv && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {errors.cvv}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
