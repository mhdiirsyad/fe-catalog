interface Seller {
    id: string,
    store_name: string,
    store_description?: string,
    pic_name: string,
    pic_phone: string,
    pic_email: string,
    pic_street: string,
    pic_RT: number,
    pic_RW: number,
    pic_village: string,
    pic_city: string,
    pic_province: string,
    status: string
}

interface SellerInput {
    store_name: string,
    store_description?: string,
    pic_name: string,
    pic_phone: string,
    pic_email: string,
    pic_street: string,
    pic_RT: number,
    pic_RW: number,
    pic_village: string,
    pic_city: string,
    pic_province: string,
    pic_ktp_number: string,
    password: string
}

export type {
    Seller,
    SellerInput
}