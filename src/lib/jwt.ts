const encoder = new TextEncoder();

const SECRET_KEY = process.env.JWT_SECRET;

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export const createJWT = async (payload: any) => {
  const header = { alg: "HS256", typ: "JWT" };

  const segments = [
    btoa(JSON.stringify(header)),
    btoa(JSON.stringify(payload)),
  ];

  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(segments.join("."))
  );

  // @ts-ignore
  segments.push(btoa(String.fromCharCode(...new Uint8Array(signature))));
  return segments.join(".");
};

export const verifyJWT = async (token: any) => {
  const segments = token.split(".");

  if (segments.length !== 3) {
    throw new Error("JWT must have 3 segments");
  }

  const [header64, payload64, signature64] = segments;
  const data = segments.slice(0, 2).join(".");

  const key = await getKey();
  const signature = Uint8Array.from(atob(signature64), (c) => c.charCodeAt(0));

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(data)
  );

  if (!isValid) {
    throw new Error("Invalid signature");
  }

  return JSON.parse(atob(payload64));
};
