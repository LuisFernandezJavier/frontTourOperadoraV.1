
export class Itinerario {
    protected itinerarioId: string;
    protected nombreHotel: string;
    protected coordenadasHotel: number;
    protected ciudad: string;
    protected precioNoche: number;
    constructor(
        itinerarioId: string ,
        nombreHotel: string ,
        coordenadasHotel: number , 
        ciudad: string , 
        precioNoche: number ,
    ) {

        this.itinerarioId = itinerarioId;
        this.nombreHotel = nombreHotel;
        this.coordenadasHotel = coordenadasHotel;
        this.ciudad = ciudad;
        this.precioNoche = precioNoche
    }
    get ItinerarioId() {
        return this.itinerarioId;
    }
    get NombreHotel(){
         return this.nombreHotel; 
    }
    get CoordenadasHotel(){
         return this.coordenadasHotel; 
    }
    get Ciudad(){
         return this.ciudad;  
    }
    get PrecioNoche(){
         return this.precioNoche; 
    }


}