[
  {
    "table_schema": "auth",
    "table_name": "audit_log_entries",
    "column_name": "instance_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "audit_log_entries",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "audit_log_entries",
    "column_name": "payload",
    "data_type": "json",
    "udt_name": "json",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "audit_log_entries",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "audit_log_entries",
    "column_name": "ip_address",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": "''::character varying"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "provider_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "identifier",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "client_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "client_secret",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "acceptable_client_ids",
    "data_type": "ARRAY",
    "udt_name": "_text",
    "is_nullable": "NO",
    "column_default": "'{}'::text[]"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "scopes",
    "data_type": "ARRAY",
    "udt_name": "_text",
    "is_nullable": "NO",
    "column_default": "'{}'::text[]"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "pkce_enabled",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "true"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "attribute_mapping",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": "'{}'::jsonb"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "authorization_params",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": "'{}'::jsonb"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "enabled",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "true"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "email_optional",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "issuer",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "discovery_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "skip_nonce_check",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "cached_discovery",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "discovery_cached_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "authorization_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "token_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "userinfo_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "jwks_uri",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "custom_oauth_providers",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "auth_code",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "code_challenge_method",
    "data_type": "USER-DEFINED",
    "udt_name": "code_challenge_method",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "code_challenge",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "provider_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "provider_access_token",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "provider_refresh_token",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "authentication_method",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "auth_code_issued_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "invite_token",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "referrer",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "oauth_client_state_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "linking_target_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "flow_state",
    "column_name": "email_optional",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "auth",
    "table_name": "identities",
    "column_name": "provider_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "identities",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "identities",
    "column_name": "identity_data",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "identities",
    "column_name": "provider",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "identities",
    "column_name": "last_sign_in_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "identities",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "identities",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "identities",
    "column_name": "email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "identities",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "auth",
    "table_name": "instances",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "instances",
    "column_name": "uuid",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "instances",
    "column_name": "raw_base_config",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "instances",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "instances",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_amr_claims",
    "column_name": "session_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_amr_claims",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_amr_claims",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_amr_claims",
    "column_name": "authentication_method",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_amr_claims",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_challenges",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_challenges",
    "column_name": "factor_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_challenges",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_challenges",
    "column_name": "verified_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_challenges",
    "column_name": "ip_address",
    "data_type": "inet",
    "udt_name": "inet",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_challenges",
    "column_name": "otp_code",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_challenges",
    "column_name": "web_authn_session_data",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "friendly_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "factor_type",
    "data_type": "USER-DEFINED",
    "udt_name": "factor_type",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "udt_name": "factor_status",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "secret",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "last_challenged_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "web_authn_credential",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "web_authn_aaguid",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "column_name": "last_webauthn_challenge_data",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "authorization_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "client_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "redirect_uri",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "scope",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "state",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "resource",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "code_challenge",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "code_challenge_method",
    "data_type": "USER-DEFINED",
    "udt_name": "code_challenge_method",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "response_type",
    "data_type": "USER-DEFINED",
    "udt_name": "oauth_response_type",
    "is_nullable": "NO",
    "column_default": "'code'::auth.oauth_response_type"
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "udt_name": "oauth_authorization_status",
    "is_nullable": "NO",
    "column_default": "'pending'::auth.oauth_authorization_status"
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "authorization_code",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "expires_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "(now() + '00:03:00'::interval)"
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "approved_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_authorizations",
    "column_name": "nonce",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_client_states",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_client_states",
    "column_name": "provider_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_client_states",
    "column_name": "code_verifier",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_client_states",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "client_secret_hash",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "registration_type",
    "data_type": "USER-DEFINED",
    "udt_name": "oauth_registration_type",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "redirect_uris",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "grant_types",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "client_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "client_uri",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "logo_uri",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "deleted_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "client_type",
    "data_type": "USER-DEFINED",
    "udt_name": "oauth_client_type",
    "is_nullable": "NO",
    "column_default": "'confidential'::auth.oauth_client_type"
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_clients",
    "column_name": "token_endpoint_auth_method",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_consents",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_consents",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_consents",
    "column_name": "client_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_consents",
    "column_name": "scopes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_consents",
    "column_name": "granted_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "oauth_consents",
    "column_name": "revoked_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "one_time_tokens",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "one_time_tokens",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "one_time_tokens",
    "column_name": "token_type",
    "data_type": "USER-DEFINED",
    "udt_name": "one_time_token_type",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "one_time_tokens",
    "column_name": "token_hash",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "one_time_tokens",
    "column_name": "relates_to",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "one_time_tokens",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "udt_name": "timestamp",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "one_time_tokens",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "udt_name": "timestamp",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "column_name": "instance_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": "nextval('auth.refresh_tokens_id_seq'::regclass)"
  },
  {
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "column_name": "token",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "column_name": "user_id",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "column_name": "revoked",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "column_name": "parent",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "column_name": "session_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_providers",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_providers",
    "column_name": "sso_provider_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_providers",
    "column_name": "entity_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_providers",
    "column_name": "metadata_xml",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_providers",
    "column_name": "metadata_url",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_providers",
    "column_name": "attribute_mapping",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_providers",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_providers",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_providers",
    "column_name": "name_id_format",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_relay_states",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_relay_states",
    "column_name": "sso_provider_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_relay_states",
    "column_name": "request_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_relay_states",
    "column_name": "for_email",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_relay_states",
    "column_name": "redirect_to",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_relay_states",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_relay_states",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "saml_relay_states",
    "column_name": "flow_state_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "schema_migrations",
    "column_name": "version",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "factor_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "aal",
    "data_type": "USER-DEFINED",
    "udt_name": "aal_level",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "not_after",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "refreshed_at",
    "data_type": "timestamp without time zone",
    "udt_name": "timestamp",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "user_agent",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "ip",
    "data_type": "inet",
    "udt_name": "inet",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "tag",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "oauth_client_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "refresh_token_hmac_key",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "refresh_token_counter",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sessions",
    "column_name": "scopes",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_domains",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_domains",
    "column_name": "sso_provider_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_domains",
    "column_name": "domain",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_domains",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_domains",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_providers",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_providers",
    "column_name": "resource_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_providers",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_providers",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "sso_providers",
    "column_name": "disabled",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "instance_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "aud",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "role",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "email",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "encrypted_password",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "email_confirmed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "invited_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "confirmation_token",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "confirmation_sent_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "recovery_token",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "recovery_sent_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "email_change_token_new",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "email_change",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "email_change_sent_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "last_sign_in_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "raw_app_meta_data",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "raw_user_meta_data",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "is_super_admin",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "phone",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "NULL::character varying"
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "phone_confirmed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "phone_change",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "''::character varying"
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "phone_change_token",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "''::character varying"
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "phone_change_sent_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "confirmed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "email_change_token_current",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "''::character varying"
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "email_change_confirm_status",
    "data_type": "smallint",
    "udt_name": "int2",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "banned_until",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "reauthentication_token",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": "''::character varying"
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "reauthentication_sent_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "is_sso_user",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "deleted_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "users",
    "column_name": "is_anonymous",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_challenges",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_challenges",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_challenges",
    "column_name": "challenge_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_challenges",
    "column_name": "session_data",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_challenges",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_challenges",
    "column_name": "expires_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "credential_id",
    "data_type": "bytea",
    "udt_name": "bytea",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "public_key",
    "data_type": "bytea",
    "udt_name": "bytea",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "attestation_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "aaguid",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "sign_count",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "transports",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": "'[]'::jsonb"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "backup_eligible",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "backed_up",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "friendly_name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "auth",
    "table_name": "webauthn_credentials",
    "column_name": "last_used_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "userid",
    "data_type": "oid",
    "udt_name": "oid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "dbid",
    "data_type": "oid",
    "udt_name": "oid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "toplevel",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "queryid",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "query",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "plans",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "total_plan_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "min_plan_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "max_plan_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "mean_plan_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "stddev_plan_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "calls",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "total_exec_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "min_exec_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "max_exec_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "mean_exec_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "stddev_exec_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "rows",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "shared_blks_hit",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "shared_blks_read",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "shared_blks_dirtied",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "shared_blks_written",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "local_blks_hit",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "local_blks_read",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "local_blks_dirtied",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "local_blks_written",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "temp_blks_read",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "temp_blks_written",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "shared_blk_read_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "shared_blk_write_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "local_blk_read_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "local_blk_write_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "temp_blk_read_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "temp_blk_write_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "wal_records",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "wal_fpi",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "wal_bytes",
    "data_type": "numeric",
    "udt_name": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_functions",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_generation_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_inlining_count",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_inlining_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_optimization_count",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_optimization_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_emission_count",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_emission_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_deform_count",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "jit_deform_time",
    "data_type": "double precision",
    "udt_name": "float8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "stats_since",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "column_name": "minmax_stats_since",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements_info",
    "column_name": "dealloc",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "extensions",
    "table_name": "pg_stat_statements_info",
    "column_name": "stats_reset",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "chapter_visit_stats",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('chapter_visit_stats_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "chapter_visit_stats",
    "column_name": "chapter_id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "chapter_visit_stats",
    "column_name": "view_count",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "table_schema": "public",
    "table_name": "chapter_visit_stats",
    "column_name": "date",
    "data_type": "date",
    "udt_name": "date",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('chapters_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "subject_id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "number",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "title",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "is_completed",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "is_locked",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "level_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "chapters",
    "column_name": "slug",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "course_sections",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('course_sections_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "course_sections",
    "column_name": "course_id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "course_sections",
    "column_name": "title",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "course_sections",
    "column_name": "content",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "table_schema": "public",
    "table_name": "course_sections",
    "column_name": "order_num",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "course_sections",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "courses",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('courses_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "courses",
    "column_name": "chapter_id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "courses",
    "column_name": "title",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "courses",
    "column_name": "content",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "courses",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "courses",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('evaluations_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "subject_id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "title",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "year",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "has_subject",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "has_solution",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "subject_url",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "solution_url",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "evaluations",
    "column_name": "level_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('exercises_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "chapter_id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "number",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "title",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "question",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "hint",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "solution",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "category",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "exercises",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "favorites",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('favorites_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "favorites",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "favorites",
    "column_name": "resource_id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "favorites",
    "column_name": "resource_type",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "favorites",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "levels",
    "column_name": "name",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "levels",
    "column_name": "description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "table_schema": "public",
    "table_name": "levels",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "levels",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "levels",
    "column_name": "id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "levels",
    "column_name": "slug",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "notifications",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('notifications_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "notifications",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "notifications",
    "column_name": "title",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "notifications",
    "column_name": "message",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "notifications",
    "column_name": "is_read",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "notifications",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "full_name",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "role",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": "'student'::character varying"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "class_level",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": "'terminale'::character varying"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "email",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "preferences_notifications",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "true"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "preferences_offline_mode",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "quiz_scores",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('quiz_scores_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "quiz_scores",
    "column_name": "user_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "quiz_scores",
    "column_name": "quiz_id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "quiz_scores",
    "column_name": "score",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "quiz_scores",
    "column_name": "total_questions",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "quiz_scores",
    "column_name": "correct_answers",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "quiz_scores",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "quizzes",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('quizzes_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "quizzes",
    "column_name": "chapter_id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "quizzes",
    "column_name": "question",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "quizzes",
    "column_name": "options",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": "'[]'::jsonb"
  },
  {
    "table_schema": "public",
    "table_name": "quizzes",
    "column_name": "correct_index_val",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "table_schema": "public",
    "table_name": "quizzes",
    "column_name": "explanation",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "table_schema": "public",
    "table_name": "quizzes",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "quizzes",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "subjects",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "nextval('subjects_id_seq'::regclass)"
  },
  {
    "table_schema": "public",
    "table_name": "subjects",
    "column_name": "name",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subjects",
    "column_name": "icon",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": "'BookOpen'::character varying"
  },
  {
    "table_schema": "public",
    "table_name": "subjects",
    "column_name": "color",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": "'blue'::character varying"
  },
  {
    "table_schema": "public",
    "table_name": "subjects",
    "column_name": "progress",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "table_schema": "public",
    "table_name": "subjects",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "subjects",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "subjects",
    "column_name": "level_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subjects",
    "column_name": "slug",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "messages",
    "column_name": "topic",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "messages",
    "column_name": "extension",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "messages",
    "column_name": "payload",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "messages",
    "column_name": "event",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "messages",
    "column_name": "private",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_schema": "realtime",
    "table_name": "messages",
    "column_name": "updated_at",
    "data_type": "timestamp without time zone",
    "udt_name": "timestamp",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "realtime",
    "table_name": "messages",
    "column_name": "inserted_at",
    "data_type": "timestamp without time zone",
    "udt_name": "timestamp",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "realtime",
    "table_name": "messages",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "realtime",
    "table_name": "messages",
    "column_name": "binary_payload",
    "data_type": "bytea",
    "udt_name": "bytea",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "schema_migrations",
    "column_name": "version",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "schema_migrations",
    "column_name": "inserted_at",
    "data_type": "timestamp without time zone",
    "udt_name": "timestamp",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "column_name": "id",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "column_name": "subscription_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "column_name": "entity",
    "data_type": "regclass",
    "udt_name": "regclass",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "column_name": "filters",
    "data_type": "ARRAY",
    "udt_name": "_user_defined_filter",
    "is_nullable": "NO",
    "column_default": "'{}'::realtime.user_defined_filter[]"
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "column_name": "claims",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "column_name": "claims_role",
    "data_type": "regrole",
    "udt_name": "regrole",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "udt_name": "timestamp",
    "is_nullable": "NO",
    "column_default": "timezone('utc'::text, now())"
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "column_name": "action_filter",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": "'*'::text"
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "column_name": "selected_columns",
    "data_type": "ARRAY",
    "udt_name": "_text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "owner",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "public",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "avif_autodetection",
    "data_type": "boolean",
    "udt_name": "bool",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "file_size_limit",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "allowed_mime_types",
    "data_type": "ARRAY",
    "udt_name": "_text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "owner_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "column_name": "type",
    "data_type": "USER-DEFINED",
    "udt_name": "buckettype",
    "is_nullable": "NO",
    "column_default": "'STANDARD'::storage.buckettype"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_analytics",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_analytics",
    "column_name": "type",
    "data_type": "USER-DEFINED",
    "udt_name": "buckettype",
    "is_nullable": "NO",
    "column_default": "'ANALYTICS'::storage.buckettype"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_analytics",
    "column_name": "format",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "'ICEBERG'::text"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_analytics",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_analytics",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_analytics",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_analytics",
    "column_name": "deleted_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_vectors",
    "column_name": "id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_vectors",
    "column_name": "type",
    "data_type": "USER-DEFINED",
    "udt_name": "buckettype",
    "is_nullable": "NO",
    "column_default": "'VECTOR'::storage.buckettype"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_vectors",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets_vectors",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "migrations",
    "column_name": "id",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "migrations",
    "column_name": "name",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "migrations",
    "column_name": "hash",
    "data_type": "character varying",
    "udt_name": "varchar",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "migrations",
    "column_name": "executed_at",
    "data_type": "timestamp without time zone",
    "udt_name": "timestamp",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "bucket_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "owner",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "last_accessed_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "metadata",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "path_tokens",
    "data_type": "ARRAY",
    "udt_name": "_text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "version",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "owner_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "column_name": "user_metadata",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "in_progress_size",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "upload_signature",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "bucket_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "key",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "version",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "owner_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "user_metadata",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads",
    "column_name": "metadata",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "upload_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "size",
    "data_type": "bigint",
    "udt_name": "int8",
    "is_nullable": "NO",
    "column_default": "0"
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "part_number",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "bucket_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "key",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "etag",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "owner_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "version",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "s3_multipart_uploads_parts",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "vector_indexes",
    "column_name": "id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "storage",
    "table_name": "vector_indexes",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "vector_indexes",
    "column_name": "bucket_id",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "vector_indexes",
    "column_name": "data_type",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "vector_indexes",
    "column_name": "dimension",
    "data_type": "integer",
    "udt_name": "int4",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "vector_indexes",
    "column_name": "distance_metric",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "vector_indexes",
    "column_name": "metadata_configuration",
    "data_type": "jsonb",
    "udt_name": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "storage",
    "table_name": "vector_indexes",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "storage",
    "table_name": "vector_indexes",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "supabase_migrations",
    "table_name": "schema_migrations",
    "column_name": "version",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "supabase_migrations",
    "table_name": "schema_migrations",
    "column_name": "statements",
    "data_type": "ARRAY",
    "udt_name": "_text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "supabase_migrations",
    "table_name": "schema_migrations",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "decrypted_secrets",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "decrypted_secrets",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "decrypted_secrets",
    "column_name": "description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "decrypted_secrets",
    "column_name": "secret",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "decrypted_secrets",
    "column_name": "decrypted_secret",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "decrypted_secrets",
    "column_name": "key_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "decrypted_secrets",
    "column_name": "nonce",
    "data_type": "bytea",
    "udt_name": "bytea",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "decrypted_secrets",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "decrypted_secrets",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "secrets",
    "column_name": "id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "vault",
    "table_name": "secrets",
    "column_name": "name",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "secrets",
    "column_name": "description",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": "''::text"
  },
  {
    "table_schema": "vault",
    "table_name": "secrets",
    "column_name": "secret",
    "data_type": "text",
    "udt_name": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "secrets",
    "column_name": "key_id",
    "data_type": "uuid",
    "udt_name": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "vault",
    "table_name": "secrets",
    "column_name": "nonce",
    "data_type": "bytea",
    "udt_name": "bytea",
    "is_nullable": "YES",
    "column_default": "vault._crypto_aead_det_noncegen()"
  },
  {
    "table_schema": "vault",
    "table_name": "secrets",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  },
  {
    "table_schema": "vault",
    "table_name": "secrets",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "udt_name": "timestamptz",
    "is_nullable": "NO",
    "column_default": "CURRENT_TIMESTAMP"
  }
]