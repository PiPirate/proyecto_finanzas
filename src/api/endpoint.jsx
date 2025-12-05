// src/api/endpoint.jsx
const API_BASE_URL = 'https://service.infidevelop.com.co:8009';

// Helper genérico
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;

    try {
      // Intentamos leer el body como JSON primero
      const errorBody = await response.json();
      console.error('❌ Backend error JSON:', errorBody);

      message =
        errorBody.descripcion ||
        errorBody.detail ||
        errorBody.title ||
        message;
    } catch (_) {
      // Si no es JSON, lo leemos como texto plano
      try {
        const text = await response.text();
        console.error('❌ Backend error TEXT:', text);
        if (text) message = `${message} - ${text}`;
      } catch (e2) {
        // ignoramos si tampoco se puede leer
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

/* ================= ENDPOINTS BÁSICOS ================= */

// Lista de beneficiarios
export async function getBeneficiarios() {
  return request('/educacion');
}

// Usuario por id
export async function getBeneficiarioById(id) {
  return request(`/educacion/${id}`);
}

// Usuario por documento
export async function getBeneficiarioByDocumento(documento) {
  const lista = await getBeneficiarios();

  const docNormalizado = (documento || '').trim();

  const usuario = lista.find(
    (b) => (b.documento || '').trim() === docNormalizado
  );

  return usuario || null;
}

// PUT para actualizar beneficiario
export async function updateBeneficiario(payload) {
  console.log(
    '>>> PUT /educacion/{id} - payload que se envía:',
    payload
  );

  return request(`/educacion/${payload.id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}


/* ========== ACTUALIZAR SOLO NIVEL ========== */

export async function actualizarNivel(usuario, nuevoNivel) {
  const doc = (usuario.documento || '').trim();
  const userFull = await getBeneficiarioByDocumento(doc);

  if (!userFull) {
    throw new Error(`No se encontró usuario con documento ${doc}`);
  }

  const id = userFull.id;

  const payload = {
    ...userFull,
    nivelactual: nuevoNivel,
  };

  console.log(">>> Payload FINAL enviado al backend:", payload);

  // PUT /educacion/{id}
  await updateBeneficiario(payload);

  return getBeneficiarioById(id);
}

