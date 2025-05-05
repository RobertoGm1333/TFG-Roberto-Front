export default class SolicitudAdopcionDto {
    constructor(
        public id_Solicitud: number,
        public id_Usuario: number,
        public id_Gato: number,
        public fecha_Solicitud: Date,
        public estado: string,
        public comentario_Usuario: string,
        public comentario_Protectora: string
    ) {}
}
