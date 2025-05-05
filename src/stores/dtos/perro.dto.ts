export default class PerroDto {
    constructor(
        public id_Perro: number,
        public id_Protectora: number,
        public nombre_Perro: string,
        public raza: string,
        public edad: number,
        public esterilizado: boolean,
        public sexo: string,
        public descripcion_Perro: string,
        public imagen_Perro: string,
    ) { }
}