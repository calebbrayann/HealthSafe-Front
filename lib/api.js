
// API CLIENT POUR HEALTHSAFE

// Fichier contenant toutes les fonctions d'API pour l'application HealthSafe
// URL de base : https://healthsafe-v1-production.up.railway.app/api

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://healthsafe-v1-production.up.railway.app/api';


// UTILITAIRES

/**
 * Récupère le token JWT depuis le localStorage ou les cookies
 * @returns {string|null} Le token JWT ou null s'il n'existe pas
 */
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // Essayer d'abord le localStorage
    const localToken = localStorage.getItem('token');
    if (localToken) {
      return localToken;
    }
    
    // Si pas de token dans localStorage, essayer de récupérer depuis les cookies
    // Note: Les cookies httpOnly ne sont pas accessibles via JavaScript
    // Le token sera automatiquement envoyé par le navigateur avec credentials: 'include'
    return null;
  }
  return null;
};

/**
 * Crée les headers pour les requêtes API
 * @param {boolean} includeAuth - Si true, inclut le header Authorization
 * @returns {Object} Les headers de la requête
 */
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Effectue une requête API avec gestion d'erreurs
 * @param {string} endpoint - L'endpoint de l'API
 * @param {Object} options - Les options de la requête fetch
 * @returns {Promise<Object>} La réponse JSON de l'API
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
  const url = `${API_BASE_URL}${endpoint}`;
    
    // Log détaillé pour diagnostiquer les problèmes
    console.log('Appel API:', {
      url: url,
      method: options.method || 'GET',
      headers: {
        ...createHeaders(options.includeAuth !== false),
        ...options.headers,
      },
      body: options.body ? JSON.parse(options.body) : undefined,
      credentials: 'include'
    });

    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Inclure les cookies cross-origin
      headers: {
        ...createHeaders(options.includeAuth !== false),
        ...options.headers,
      },
    });

    console.log('Réponse API:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erreur HTTP:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Données reçues:', data);
    return data;
  } catch (error) {
    console.error('Erreur API complète:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      endpoint: endpoint,
      options: options
    });
    
    // Améliorer la gestion des erreurs réseau
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet ou contactez l\'administrateur.');
    }
    throw error;
  }
};


// AUTHENTIFICATION


/**
 * Connexion utilisateur
 * @param {Object} credentials - Les identifiants de connexion
 * @param {string} credentials.email - Email de l'utilisateur
 * @param {string} credentials.password - Mot de passe
 * @returns {Promise<Object>} Réponse de l'API avec token
 */
export const login = async (credentials) => {
  try {
    console.log('Tentative de connexion...');
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include', //  Pour recevoir les cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log(' Réponse login:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(' Login réussi:', data);
    
    // Vérifier si les cookies sont bien reçus
    if (typeof document !== 'undefined') {
      console.log('Cookies après login:', document.cookie);
    }
    
    return data;
  } catch (error) {
    console.error(' Erreur login:', error);
    throw error;
  }
};

/**
 * Récupère l'utilisateur courant (via cookie httpOnly)
 * @returns {Promise<Object>} Le profil utilisateur
 */
export const getMe = async () => {
  try {
    console.log(' Appel /auth/me...');
    
    // Vérifier les cookies côté client (si possible)
    if (typeof document !== 'undefined') {
      console.log(' Cookies côté client:', document.cookie);
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', //  Envoie les cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(' Réponse /auth/me:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(' Erreur /auth/me:', errorData);
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Données /auth/me reçues:', data);
    return data;
  } catch (error) {
    console.error(' Erreur complète /auth/me:', error);
    throw error;
  }
};

/**
 * Déconnexion utilisateur
 * @returns {Promise<Object>} Réponse de l'API
 */
export const logout = async () => {
  return apiRequest('/auth/logout', {
    method: 'POST',
  });
};

/**
 * Inscription d'un patient
 * @param {Object} patientData - Les données du patient
 * @returns {Promise<Object>} Réponse de l'API
 */
export const registerPatient = async (patientData) => {
  return apiRequest('/auth/register-patient', {
    method: 'POST',
    body: JSON.stringify(patientData),
    includeAuth: false,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Inscription d'un médecin
 * @param {Object} medecinData - Les données du médecin
 * @returns {Promise<Object>} Réponse de l'API
 */
export const registerMedecin = async (medecinData) => {
  return apiRequest('/auth/register-medecin', {
    method: 'POST',
    body: JSON.stringify(medecinData),
    includeAuth: false,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Vérification d'email avec token
 * @param {string} token - Le token de vérification
 * @returns {Promise<Object>} Réponse de l'API
 */
export const verifyEmail = async (token) => {
  return apiRequest(`/auth/verify/${token}`, {
    method: 'GET',
    includeAuth: false,
  });
};

/**
 * Demande de réinitialisation de mot de passe
 * @param {Object} data - Les données de la demande
 * @param {string} data.email - Email de l'utilisateur
 * @returns {Promise<Object>} Réponse de l'API
 */
export const requestResetPassword = async (data) => {
  return apiRequest('/auth/request-reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
    includeAuth: false,
  });
};

/**
 * Réinitialisation de mot de passe avec token
 * @param {string} token - Le token de réinitialisation
 * @param {Object} data - Les nouvelles données de mot de passe
 * @returns {Promise<Object>} Réponse de l'API
 */
export const resetPassword = async (token, data) => {
  return apiRequest(`/auth/reset-password/${token}`, {
    method: 'POST',
    body: JSON.stringify(data),
    includeAuth: false,
  });
};

/**
 * Test de connectivité avec l'API
 * @returns {Promise<Object>} Réponse de l'API
 */
export const testApiConnection = async () => {
  return apiRequest('/test-login', {
    method: 'GET',
    includeAuth: false,
  });
};

/**
 * Test détaillé de l'API avec logging complet
 * @returns {Promise<Object>} Résultat du test
 */
export const testApiDetailed = async () => {
  console.log('Test détaillé de l\'API HealthSafe');
  console.log(' URL de base:', API_BASE_URL);
  
  try {
    // Test 1: Connexion de base
    console.log('\n Test 1: Connexion de base');
    const testUrl = `${API_BASE_URL}/test-login`;
    console.log('URL testée:', testUrl);
    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Statut:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      const data = await response.text();
      console.log('Réponse brute:', data);
    } catch (error) {
      console.error('Erreur lors du test de connexion de base:', error);
    }
    // Test 2: Test de login avec données factices
    console.log('\nTest 2: Test de login');
    const loginUrl = `${API_BASE_URL}/auth/login`;
    console.log('URL login:', loginUrl);
    try {
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: '123456'
        }),
      });
      console.log('Statut login:', loginResponse.status);
      console.log('Headers login:', Object.fromEntries(loginResponse.headers.entries()));
      const loginData = await loginResponse.text();
      console.log('Réponse login:', loginData);
    } catch (error) {
      console.error('Erreur lors du test de login:', error);
    }
    return {
      success: true,
      baseUrl: API_BASE_URL,
      testUrl: testUrl,
      loginUrl: loginUrl,
      testStatus: response.status,
      loginStatus: loginResponse.status,
      testData: data,
      loginData: loginData
    };
    
  } catch (error) {
    console.error(' Erreur lors du test:', error);
    return {
      success: false,
      error: error.message,
      baseUrl: API_BASE_URL
    };
  }
};

/**
 * Réinitialisation du code patient
 * @param {Object} data - Les données pour la réinitialisation
 * @returns {Promise<Object>} Réponse de l'API
 */
export const resetCodePatient = async (data) => {
  return apiRequest('/auth/reset-code-patient', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// DOSSIERS MÉDICAUX

/**
 * Création d'un nouveau dossier médical
 * @param {Object} dossierData - Les données du dossier
 * @returns {Promise<Object>} Réponse de l'API
 */
export const createDossier = async (dossierData) => {
  return apiRequest('/dossiers/', {
    method: 'POST',
    body: JSON.stringify(dossierData),
  });
};

/**
 * Récupération des dossiers d'un patient
 * @param {Object} patientData - Les données du patient
 * @returns {Promise<Object>} Réponse de l'API
 */
export const getPatientDossiers = async (patientData) => {
  return apiRequest('/dossiers/patient', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
};

/**
 * Récupération des autorisations d'un dossier
 * @param {string} numeroDossier - Le numéro du dossier
 * @returns {Promise<Object>} Réponse de l'API
 */
export const getAutorisations = async (numeroDossier) => {
  return apiRequest(`/dossiers/numero/${numeroDossier}/autorisations`, {
    method: 'GET',
  });
};

/**
 * Récupération d'un dossier spécifique
 * @param {string} numeroDossier - Le numéro du dossier
 * @returns {Promise<Object>} Réponse de l'API
 */
export const getDossier = async (numeroDossier) => {
  return apiRequest(`/dossiers/${numeroDossier}`, {
    method: 'GET',
  });
};

/**
 * Mise à jour d'un dossier
 * @param {string} numeroDossier - Le numéro du dossier
 * @param {Object} dossierData - Les nouvelles données du dossier
 * @returns {Promise<Object>} Réponse de l'API
 */
export const updateDossier = async (numeroDossier, dossierData) => {
  return apiRequest(`/dossiers/${numeroDossier}`, {
    method: 'PUT',
    body: JSON.stringify(dossierData),
  });
};

/**
 * Récupération de l'historique d'un dossier
 * @param {string} numeroDossier - Le numéro du dossier
 * @returns {Promise<Object>} Réponse de l'API
 */
export const getDossierHistorique = async (numeroDossier) => {
  return apiRequest(`/dossiers/${numeroDossier}/historique`, {
    method: 'GET',
  });
};

/**
 * Autorisation d'un médecin sur un dossier
 * @param {string} numeroDossier - Le numéro du dossier
 * @param {Object} autorisationData - Les données d'autorisation
 * @returns {Promise<Object>} Réponse de l'API
 */
export const autoriserMedecin = async (numeroDossier, autorisationData) => {
  return apiRequest(`/dossiers/${numeroDossier}/autoriser`, {
    method: 'POST',
    body: JSON.stringify(autorisationData),
  });
};

/**
 * Upload d'un fichier dans un dossier
 * @param {string} numeroDossier - Le numéro du dossier
 * @param {FormData} formData - Les données du fichier à uploader
 * @returns {Promise<Object>} Réponse de l'API
 */
export const uploadFichier = async (numeroDossier, formData) => {
  try {
    const url = `${API_BASE_URL}/dossiers/${numeroDossier}/fichiers`;
    const token = getAuthToken();
    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Ne pas définir Content-Type pour FormData
        },
        body: formData,
      });
    } catch (error) {
      console.error('Erreur réseau lors de l\'upload du fichier:', error);
      throw new Error('Erreur réseau lors de l\'upload du fichier.');
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur upload fichier:', error);
    throw error;
  }
};

// GESTION DES ACCÈS

/**
 * Demande d'accès à un dossier
 * @param {Object} demandeData - Les données de la demande
 * @returns {Promise<Object>} Réponse de l'API
 */
export const demanderAcces = async (demandeData) => {
  return apiRequest('/acces/demander', {
    method: 'POST',
    body: JSON.stringify(demandeData),
  });
};

/**
 * Réponse à une demande d'accès
 * @param {string} demandeId - L'ID de la demande
 * @param {Object} reponseData - Les données de la réponse
 * @returns {Promise<Object>} Réponse de l'API
 */
export const repondreDemande = async (demandeId, reponseData) => {
  return apiRequest(`/acces/repondre/${demandeId}`, {
    method: 'POST',
    body: JSON.stringify(reponseData),
  });
};

/**
 * Révocation d'un accès
 * @param {Object} revocationData - Les données de révocation
 * @returns {Promise<Object>} Réponse de l'API
 */
export const revoquerAcces = async (revocationData) => {
  return apiRequest('/acces/revoquer', {
    method: 'POST',
    body: JSON.stringify(revocationData),
  });
};

/**
 * Liste des accès autorisés
 * @returns {Promise<Object>} Réponse de l'API
 */
export const listeAcces = async () => {
  return apiRequest('/acces/liste', {
    method: 'GET',
  });
};


// ADMINISTRATION

/**
 * Promotion d'un médecin en admin
 * @param {Object} promotionData - Les données de promotion
 * @returns {Promise<Object>} Réponse de l'API
 */
export const promouvoirMedecinEnAdmin = async (promotionData) => {
  return apiRequest('/admin/promouvoir-medecin', {
    method: 'POST',
    body: JSON.stringify(promotionData),
  });
};

/**
 * Validation d'un admin d'hôpital
 * @param {Object} validationData - Les données de validation
 * @returns {Promise<Object>} Réponse de l'API
 */
export const validerAdminHopital = async (validationData) => {
  return apiRequest('/admin/valider-admin', {
    method: 'POST',
    body: JSON.stringify(validationData),
  });
};

/**
 * Révocation d'un admin d'hôpital
 * @param {Object} revocationData - Les données de révocation
 * @returns {Promise<Object>} Réponse de l'API
 */
export const revoquerAdmin = async (revocationData) => {
  return apiRequest('/admin/admin-hopital', {
    method: 'DELETE',
    body: JSON.stringify(revocationData),
  });
};

/**
 * Validation d'un médecin
 * @param {Object} validationData - Les données de validation
 * @returns {Promise<Object>} Réponse de l'API
 */
export const validerMedecin = async (validationData) => {
  return apiRequest('/admin/valider-medecin', {
    method: 'POST',
    body: JSON.stringify(validationData),
  });
};

/**
 * Récupération de la liste des médecins
 * @param {Object} queryParams - Paramètres de requête (optionnel)
 * @returns {Promise<Object>} Réponse de l'API
 */
export const getMedecins = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = queryString ? `/admin/medecins?${queryString}` : '/admin/medecins';
  
  return apiRequest(endpoint, {
    method: 'GET',
  });
};

/**
 * Recherche de médecins
 * @param {Object} searchParams - Paramètres de recherche
 * @returns {Promise<Object>} Réponse de l'API
 */
export const searchMedecins = async (searchParams) => {
  const queryString = new URLSearchParams(searchParams).toString();
  return apiRequest(`/admin/medecins/search?${queryString}`, {
    method: 'GET',
  });
};

/**
 * Suppression d'un médecin
 * @param {Object} suppressionData - Les données de suppression
 * @returns {Promise<Object>} Réponse de l'API
 */
export const supprimerMedecin = async (suppressionData) => {
  return apiRequest('/admin/medecins', {
    method: 'DELETE',
    body: JSON.stringify(suppressionData),
  });
};

/**
 * Récupération de la liste des utilisateurs
 * @param {Object} queryParams - Paramètres de requête (optionnel)
 * @returns {Promise<Object>} Réponse de l'API
 */
export const getUtilisateurs = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = queryString ? `/admin/utilisateurs?${queryString}` : '/admin/utilisateurs';
  
  return apiRequest(endpoint, {
    method: 'GET',
  });
};

/**
 * Réactivation d'un utilisateur
 * @param {string} id - L'ID de l'utilisateur
 * @returns {Promise<Object>} Réponse de l'API
 */
export const reactiverUtilisateur = async (id) => {
  return apiRequest(`/admin/utilisateurs/${id}/reactiver`, {
    method: 'PUT',
  });
};

/**
 * Récupération des logs système
 * @param {Object} queryParams - Paramètres de requête (optionnel)
 * @returns {Promise<Object>} Réponse de l'API
 */
export const getLogs = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = queryString ? `/admin/logs?${queryString}` : '/admin/logs';
  
  return apiRequest(endpoint, {
    method: 'GET',
  });
};

// ========================================
// EXPORT PAR DÉFAUT
// ========================================

export default {
  // Auth
  login,
  logout,
  getMe,
  registerPatient,
  registerMedecin,
  verifyEmail,
  requestResetPassword,
  resetPassword,
  resetCodePatient,
  testApiConnection,
  testApiDetailed,
  
  // Dossiers
  createDossier,
  getPatientDossiers,
  getAutorisations,
  getDossier,
  updateDossier,
  getDossierHistorique,
  autoriserMedecin,
  uploadFichier,
  
  // Accès
  demanderAcces,
  repondreDemande,
  revoquerAcces,
  listeAcces,
  
  // Admin
  promouvoirMedecinEnAdmin,
  validerAdminHopital,
  revoquerAdmin,
  validerMedecin,
  getMedecins,
  searchMedecins,
  supprimerMedecin,
  getUtilisateurs,
  reactiverUtilisateur,
  getLogs,
};