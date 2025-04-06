export interface RegisterStation {
    name: string;
    uid: string;
    latitude: number;
    longitude: number;
    address: {
        country: string;
        city: string;
        state: string;
    };
    parameter_types: number[];
}