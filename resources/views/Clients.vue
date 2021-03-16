<template>
  <v-data-table
    :headers="headers"
    :items="clients"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Administrar Clientes</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Nuevo Cliente
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                     <v-select
                     v-model="editedItem.type_document"
                     :items="types"
                     label="Tipo Documento"
                  ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.document"
                      label="Numero Documento"
                    ></v-text-field>
                  </v-col>    
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">¿Esta seguro que desea eliminar este cliente?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogVehicles" max-width="600px">
        <!--<vehicles></vehicles>
        -->
         <v-card>
            <v-card-title class="headline">Listado de vehiculos</v-card-title>
            <v-data-table
             :headers="headers_vehicles"
             :items="vehicles"
             class="elevation-1"
            >
            <template v-slot:top>
               <v-toolbar
                flat 
              >
              <v-toolbar-title>Administrar Vehiculos</v-toolbar-title>
              <v-divider
                 class="mx-4"
                 inset
                 vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog
                 v-model="dialogVehicle"
                 max-width="400px"
              >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                   color="primary"
                   dark
                   class="mb-2"
                   v-bind="attrs"
                   v-on="on"
                >
                   Nuevo Vehiculo
                </v-btn>
              </template>
              <v-card>
                 <v-card-title>
                   <span class="headline">{{ formTitleVehicle }}</span>
                 </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >
                      <v-text-field
                        v-model="editedItemVehicle.plate"
                        label="Placa/Serial"
                      ></v-text-field>
                      </v-col>
                      <v-col
                         cols="12"
                         sm="6"
                         md="6"
                      >
                      <v-select
                        v-model="editedItemVehicle.type_vehicle"
                        :items="typesVehicles"
                        label="Tipo Vehiculo"
                      ></v-select>
                      </v-col>    
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                     color="blue darken-1"
                     text
                     @click="closeVehicle"
                  >
                     Cancelar
                  </v-btn>
                  <v-btn
                     color="blue darken-1"
                     text
                     @click="saveVehicle"
                  >
                     Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDeleteVehicle" max-width="500px">
              <v-card>
                <v-card-title class="headline">¿Esta seguro que desea eliminar este vehiculo?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDeleteVehicle">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirmVehicle">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
             </v-dialog>
             <v-dialog v-model="dialogParkingLot" max-width="500px">
              <v-card>
                <v-card-title class="headline">Asignar Parqueadero</v-card-title>
                 <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                      <v-text-field
                        v-model="parking_lot.time_start"
                        type=time
                        label="Hora de Inicio"
                      ></v-text-field>
                      </v-col>
                      <v-col
                         cols="12"
                         sm="6"
                         md="4"
                      >
                      <v-select
                        v-model="parking_lot.tariff_id"
                        :items="tariffs"
                        label="Tarifa"
                      ></v-select>
                      </v-col> 
                      <v-col
                         cols="12"
                         sm="6"
                         md="4"
                      >   
                      <v-select
                        v-model="parking_lot.parking_lot_id"
                        :items="parking_lots"
                        label="Estacionamiento"
                      ></v-select>
                      </v-col> 

                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeAsign">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="confirmAsign">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
             </v-dialog>
          </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
             <v-icon
               small
              class="mr-2"
              @click="saveEditedItemVehicle(item)"
             >
               mdi-pencil
            </v-icon>
             <v-icon
               small
              class="mr-2"
              @click="assignGarage(item)"
             >
              mdi-garage-variant
            </v-icon>
            <v-icon
              small
              @click="deleteItemVehicle(item)"
            >
               mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
              No Hay Datos
         </template>
         </v-data-table>
        </v-card> 
       </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        class="mr-2"
        @click="openVehicles(item)"
      >
        mdi-car
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Refrescar
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
   export default {
      data: () => ({
      dialog: false,
      dialogDelete: false,
      dialogVehicles: false,
      dialogVehicle: false,
      dialogDeleteVehicle: false,
      dialogParkingLot: false,
      config:{
           headers:{
              'Authorization':'Bearer '+localStorage.access_token,
              'Content-Type':'application/json',
              'Accept':'application/json'
             }
      },
      apiurl:process.env.MIX_API_URL,
      types:[
          {text:'Cedula',value:'cedula'},
          {text:'Pasaporte',value:'pasaporte'},
          {text:'Cedula Extranjeria',value:'cedula de extranjeria'},
      ],
       typesVehicles:[
          {text:'automovil',value:'automovil'},
          {text:'bicicleta',value:'bicicleta'},
          {text:'moto',value:'moto'},
      ],
      headers: [
        {
          text: 'Nombres',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Tipo Documento', value: 'type_document' },
        { text: 'Numero Documento', value: 'document' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
       headers_vehicles: [
        {
          text: 'Placa',
          align: 'start',
          sortable: false,
          value: 'plate',
        },
        { text: 'Tipo Vehiculo', value: 'type_vehicle' },
        { text: 'Actions', value: 'actions', sortable: false },
        
      ],
     clients: [],
     currentClientid:'',
     currentIndexClientid:'',
      editedIndex: -1,
      editedItem: {
        id:'',
        name: '',
        type_document: 0,
        document: 0
      },
      defaultItem: {
        id:'',
        name: '',
        type_document: 0,
        document: 0  
      },
       vehicles: [],
      editedIndexVehicle: -1,
      editedItemVehicle: {
        id:'',
        plate: '',
        type_vehicle:'',
        client_id: ''
      },
      defaultItemVehicle: {
        id:'',
        plate: '',
        type_vehicle:'',
        client_id:''   
      },
      parking_lots:[],
      tariffs:[],
      parking_lot:{
        id:'',
        time_start:'',
        vehicle_id:'',
        parking_lot_id:'',
        tariff_id:'',
        client_id:''
      },
      defaultParkingLot:{
        id:'',
        time_start:'',
        vehicle_id:'',
        parking_lot_id:'',
        tariff_id:'',
        client_id:''
      }
      
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Cliente' : 'Editar Cliente'
      },
      formTitleVehicle () {
        return this.editedIndexVehicle === -1 ? 'Nuevo Vehiculo' : 'Editar Vehiculo'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
       dialogVehicle (val) {
        val || this.closeVehicle()
      },
       dialogDeleteVehicle (val) {
        val || this.closeDeleteVehicle()
      },
       dialogVehicle (val) {
        val || this.closeVehicle()
      },
       dialogDeleteVehicle (val) {
        val || this.closeDeleteVehicle()
      },
       dialogParkingLot (val) {
        val || this.closeAsign()
      },
    },
    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        axios.get(this.apiurl+'api/client/list',this.config).
         then(response=>{
           if(response.data.status=="ok"){
             this.clients=response.data.data
             if(this.currentIndexClientid !==''){
              this.vehicles=this.clients[this.currentIndexClientid].vehicles 
             }   
           }else{
             console.log(response)
           }
         }) 
      },
        getListParkingLots(type){
        axios.get(this.apiurl+'api/parking-lot/options/'+type,this.config).
         then(response=>{
           if(response.data.status=="ok"){
            this.parking_lots=response.data.data   
           }else{
             console.log(response)
           }
         })
      },
      getListTariffs(type){
        axios.get(this.apiurl+'api/tariff/options/'+type,this.config).
         then(response=>{
           if(response.data.status=="ok"){
            this.tariffs=response.data.data   
           }else{
             console.log(response)
           }
         })
      },
       editItem (item) {
        this.editedIndex = this.clients.indexOf(item)
        this.editedItem = Object.assign({}, item)  
        this.dialog = true
      },
      openVehicles(item){
        this.vehicles=item.vehicles
        this.currentClientid=item.id
        this.currentIndexClientid=this.clients.indexOf(item)
        this.dialogVehicles=true
        
      },

      deleteItem (item) {
        this.editedIndex = this.clients.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
       saveEditedItemVehicle (item) {
        this.editedIndexVehicle = this.vehicles.indexOf(item)
        this.editedItemVehicle = Object.assign({}, item)  
        
        this.dialogVehicle = true
      },
       deleteItemConfirmVehicle () {
         axios.delete(this.apiurl+'api/vehicle/destroy/'+this.editedItemVehicle.id,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message,' ');
               this.vehicles.splice(this.editedIndexVehicle, 1) 
             }else{
               this.$$vToastify.error(response.data.message, ' ')
             }
           })  
        
        this.closeDeleteVehicle()
      },
      deleteItemVehicle (item) {
        this.editedIndexVehicle = this.vehicles.indexOf(item)
        this.editedItemVehicle = Object.assign({}, item)
        this.dialogDeleteVehicle = true
      },
      deleteItemConfirm () {
         axios.delete(this.apiurl+'api/client/destroy/'+this.editedItem.id,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message,' ');
               this.initialize()  
             }else{
               this.$$vToastify.error(response.data.message, ' ')
             }
           })  
         this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

       closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
       closeVehicle () {
        this.dialogVehicle = false
        this.$nextTick(() => {
          this.editedItemVehicle = Object.assign({}, this.defaultItemVehicle)
          this.editedIndexVehicle = -1
        })
      },

      closeDeleteVehicle () {
        this.dialogDeleteVehicle = false
        this.$nextTick(() => {
          this.editedItemVehicle = Object.assign({}, this.defaultItemVehicle)
          this.editedIndexVehicle = -1
        })
      },
      closeAsign () {
         this.dialogParkingLot = false
         this.$nextTick(() => {
          this.parking_lot= Object.assign({}, this.defaultParkingLot)
       
        })
      },
      save () {
        if (this.editedIndex > -1) {
         
           axios.put(this.apiurl+'api/client/update/'+this.editedItem.id,this.editedItem,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message,' ');
               this.initialize()  
             }else{
               this.$vToastify.error(response.data.message,' ')
             }
           })  
        } else {
           axios.post(this.apiurl+'api/client/store',this.editedItem,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message, ' ');
               this.initialize()  
             }else{
               this.$vToastify.error(response.data.message,' ')
             }
             
           })
          
        }
        this.close()
      },
      assignGarage(item){
        this.getListParkingLots(item.type_vehicle)
        this.getListTariffs(item.type_vehicle)
        this.parking_lot.vehicle_id=item.id
        this.dialogParkingLot = true
      },
      confirmAsign(){
           this.parking_lot.client_id=this.currentClientid
           axios.post(this.apiurl+'api/transaction/store',this.parking_lot,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message,' ');
                this.initialize()
                this.closeAsign()
             }else{
               this.$vToastify.error(response.data.message,' ')
             }
           })  
      },
      saveVehicle () {
        if (this.editedIndexVehicle > -1) {
         
           axios.put(this.apiurl+'api/vehicle/update/'+this.editedItemVehicle.id,this.editedItemVehicle,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message,' ');
                this.initialize()
             }else{
               this.$vToastify.error(response.data.message,' ')
             }
           })  
        } else {
          this.editedItemVehicle.client_id=this.currentClientid
           axios.post(this.apiurl+'api/vehicle/store',this.editedItemVehicle,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message, ' ');
               this.initialize()
             }else{
               this.$vToastify.error(response.data.message,' ')
             }
             
           })
          
        }
        this.closeVehicle()
      },
    },
  }
</script>