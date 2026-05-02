export interface StoreAccessDTO {
	id: string;
	name: string;
	slug: string;
	schema_name: string;
}

export interface LoginResponse {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
		admin_level?: 'SUPERADMIN' | 'ADMIN';
	};
	stores?: StoreAccessDTO[];
}

export interface SelectStoreResponse {
	token: string;
	store_name: string;
	schema_name: string;
	message: string;
}