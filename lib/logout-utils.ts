/**
 * Utilitaires de déconnexion pour HealthSafe
 * Gestion robuste de la déconnexion avec fallback côté client
 */

/**
 * Nettoyage complet des données d'authentification côté client
 */
export const cleanupClientAuth = () => {
  try {
    if (typeof window !== 'undefined') {
      // Nettoyage du localStorage
      const authKeys = [
        'token',
        'user',
        'userRole',
        'refreshToken',
        'authData',
        'authToken',
        'sessionToken',
        'accessToken'
      ];
      
      authKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      // Nettoyage du sessionStorage
      sessionStorage.clear();
      
      // Nettoyage des cookies d'authentification
      const authCookieNames = [
        'auth',
        'token',
        'session',
        'jwt',
        'access_token',
        'refresh_token'
      ];
      
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Supprimer les cookies d'authentification
        if (authCookieNames.some(authName => name.toLowerCase().includes(authName))) {
          const domain = window.location.hostname;
          const baseDomain = domain.split('.').slice(-2).join('.');
          
          // Supprimer avec différents domaines et chemins
          const cookiePaths = ['/', `/;domain=${domain}`, `/;domain=.${baseDomain}`];
          
          cookiePaths.forEach(path => {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};secure`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};samesite=strict`;
          });
        }
      });
      
      // Nettoyage des données de cache
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            if (name.includes('auth') || name.includes('user') || name.includes('token')) {
              caches.delete(name);
            }
          });
        });
      }

      // Nettoyage des IndexedDB (si utilisé)
      if ('indexedDB' in window) {
        try {
          // Supprimer les bases de données d'authentification
          const authDatabases = ['auth', 'user', 'session', 'token'];
          authDatabases.forEach(dbName => {
            indexedDB.deleteDatabase(dbName);
          });
        } catch (error) {
          console.warn('Erreur lors du nettoyage IndexedDB:', error);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage côté client:', error);
  }
};

/**
 * Déconnexion forcée côté client uniquement
 * Utilisée en cas d'échec de l'API de déconnexion
 */
export const forceLogout = () => {
  cleanupClientAuth();
  
  // Redirection vers la page de connexion
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Déconnexion avec retry et fallback
 * @param logoutFunction - Fonction de déconnexion à exécuter
 * @param maxRetries - Nombre maximum de tentatives
 * @param retryDelay - Délai entre les tentatives (ms)
 */
export const logoutWithRetry = async (
  logoutFunction: () => Promise<void>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<{ success: boolean; error?: string; fallback?: boolean }> => {
  let lastError: string = '';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await logoutFunction();
      return { success: true };
    } catch (error: any) {
      lastError = error?.message || 'Erreur inconnue';
      console.warn(`Tentative ${attempt}/${maxRetries} échouée:`, error);
      
      if (attempt < maxRetries) {
        // Attendre avant la prochaine tentative
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  // Toutes les tentatives ont échoué, utiliser le fallback
  console.warn('Toutes les tentatives de déconnexion ont échoué, utilisation du fallback côté client');
  cleanupClientAuth();
  
  return { 
    success: true, 
    error: lastError, 
    fallback: true 
  };
};

/**
 * Vérification de l'état d'authentification
 * @returns true si l'utilisateur semble être connecté côté client
 */
export const isClientAuthenticated = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    // Vérifier la présence de données d'authentification
    const hasToken = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('accessToken');
    
    const hasUser = localStorage.getItem('user') || 
                   localStorage.getItem('authData');
    
    // Vérifier les cookies d'authentification
    const hasAuthCookie = document.cookie.includes('auth') || 
                         document.cookie.includes('token') || 
                         document.cookie.includes('session');
    
    return !!(hasToken || hasUser || hasAuthCookie);
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
};

/**
 * Déconnexion conditionnelle
 * Déconnecte seulement si l'utilisateur semble être connecté
 */
export const conditionalLogout = async (
  logoutFunction: () => Promise<void>
): Promise<{ success: boolean; skipped?: boolean; error?: string }> => {
  if (!isClientAuthenticated()) {
    return { success: true, skipped: true };
  }
  
  try {
    await logoutFunction();
    return { success: true };
  } catch (error: any) {
    // En cas d'erreur, nettoyer quand même côté client
    cleanupClientAuth();
    return { 
      success: true, 
      error: error?.message || 'Erreur lors de la déconnexion',
      fallback: true 
    };
  }
};
