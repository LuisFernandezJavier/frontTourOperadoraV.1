export class homeItinerario{
    protected itinerarioId: string;
    protected nombreHotel: string;
    protected cordenadasHotel: string;
    protected ciudad: string;
    protected precioNoche: number;
    protected base64: string;
    constructor(
        itinerarioId: string ,
        nombreHotel: string ,
        cordenadasHotel: string , 
        ciudad: string , 
        precioNoche: number ,
        base64: string,
    ) {

        this.itinerarioId = itinerarioId;
        this.nombreHotel = nombreHotel;
        this.cordenadasHotel = cordenadasHotel;
        this.ciudad = ciudad;
        this.precioNoche = precioNoche
        this.base64 = base64
    }
    get ItinerarioId() {
        return this.itinerarioId;
    }
    get NombreHotel(){
         return this.nombreHotel; 
    }
    get CordenadasHotel(){
         return this.cordenadasHotel; 
    }
    get Ciudad(){
         return this.ciudad;  
    }
    get PrecioNoche(){
         return this.precioNoche; 
    }
    get Base64(){
            return this.base64; 
        }
}