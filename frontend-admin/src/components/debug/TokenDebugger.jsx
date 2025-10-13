import React, { useState, useEffect } from 'react';
import { useSimpleTokenManager } from '../../hooks/useSimpleTokenManager.js';
import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';

/**
 * Componente de depuración para mostrar información del token
 * Solo se muestra en modo desarrollo
 */
export function TokenDebugger() {
  const { getTokenInfo, refreshToken } = useSimpleTokenManager();
  const [tokenInfo, setTokenInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Solo mostrar en desarrollo
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    if (!isDevelopment) return;

    const updateTokenInfo = () => {
      setTokenInfo(getTokenInfo());
    };

    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 1000);

    return () => clearInterval(interval);
  }, [getTokenInfo, isDevelopment]);

  if (!isDevelopment || !isVisible) {
    return isDevelopment ? (
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg"
        >
          🔑 Token Info
        </Button>
      </div>
    ) : null;
  }

  const handleRefreshToken = async () => {
    try {
      await refreshToken();
    } catch (error) {
      console.error('Error al refrescar token:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 max-w-sm bg-white shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold">Token Debug</h3>
          <Button
            onClick={() => setIsVisible(false)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>

        {tokenInfo && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Estado:</span>
              <Badge 
                variant={tokenInfo.hasToken ? 'success' : 'destructive'}
                className="text-xs"
              >
                {tokenInfo.hasToken ? 'Activo' : 'Sin token'}
              </Badge>
            </div>

            {tokenInfo.hasToken && (
              <>
                <div className="flex justify-between">
                  <span>Expira en:</span>
                  <span className={tokenInfo.expiresIn < 5 ? 'text-red-600' : ''}>
                    {tokenInfo.expiresIn}m
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Necesita refresh:</span>
                  <Badge 
                    variant={tokenInfo.needsRefresh ? 'warning' : 'success'}
                    className="text-xs"
                  >
                    {tokenInfo.needsRefresh ? 'Sí' : 'No'}
                  </Badge>
                </div>

                <Button
                  onClick={handleRefreshToken}
                  size="sm"
                  className="w-full mt-2"
                  variant="outline"
                >
                  Refrescar Token
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default TokenDebugger;