// ========================================
// API CLIENT POUR HEALTHSAFE
// ========================================
// Fichier contenant toutes les fonctions d'API pour l'application HealthSafe
// URL de base : https://healthsafe-v1-production.up.railway.app/api

const API_BASE_URL = 'https://healthsafe-v1-production.up.railway.app/api';

// ========================================
// UTILITAIRES
// ========================================

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
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Inclure les cookies cross-origin
      headers: {
        ...createHeaders(options.includeAuth !== false),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    // Améliorer la gestion des erreurs réseau
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet ou contactez l\'administrateur.');
    }
    throw error;
  }
};

// ========================================
// AUTHENTIFICATION
// ========================================

/**
 * Connexion utilisateur
 * @param {Object} credentials - Les identifiants de connexion
 * @param {string} credentials.email - Email de l'utilisateur
 * @param {string} credentials.password - Mot de passe
 * @returns {Promise<Object>} Réponse de l'API avec token
 */
export const login = async (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    includeAuth: false,
    headers: {
      'Content-Type': 'application/json',
    },
  });
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

// ========================================
// DOSSIERS MÉDICAUX
// ========================================

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
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Ne pas définir Content-Type pour FormData
      },
      body: formData,
    });

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

// ========================================
// GESTION DES ACCÈS
// ========================================

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

// ========================================
// ADMINISTRATION
// ========================================

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
  registerPatient,
  registerMedecin,
  verifyEmail,
  requestResetPassword,
  resetPassword,
  resetCodePatient,
  testApiConnection,
  
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
