import axios from 'axios';

type OIDCMetadata = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri?: string;
  [key: string]: any;
};

const metadataCache: Map<string, OIDCMetadata> = new Map();

/**
 * Loads and caches OIDC metadata for any provider.
 * @param issuerBaseUrl - Base URL of the provider (e.g., https://accounts.google.com)
 */
export async function loadOpenIdConfiguration(issuerBaseUrl: string): Promise<OIDCMetadata> {
  if (metadataCache.has(issuerBaseUrl)) {
    return metadataCache.get(issuerBaseUrl)!;
  }

  const wellKnownUrl = `${issuerBaseUrl}/.well-known/openid-configuration`;
  const response = await axios.get<OIDCMetadata>(wellKnownUrl);
  const metadata = response.data;
  metadataCache.set(issuerBaseUrl, metadata);
  return metadata;
}
