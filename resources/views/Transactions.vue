<template>
  <v-card>
    <v-card-title>Búsqueda</v-card-title>
  <v-card-text>
    <v-row>
      <v-col
            cols="12"
            sm="2"
            md="2"
        >
        <v-select
              v-model="type"
              :items="types"
              label="tipo de vehiculo"
              @change="changeVehicle(type)"
        ></v-select>
        </v-col>
      <v-col
        cols="12"
        sm="2"
        md="2"
      >
        <v-select
           v-model="search.plate"
            label="Placa vehiculo"
            :items="vehicles"
        ></v-select>
      </v-col>
      <v-col
       cols="12"
        sm="1"
        md="1"
      >
        <v-select
        v-model="search.parking_lot_id"
            label="Ubicacion"
            :items="parking_lots"
        ></v-select>
      </v-col>
      <v-col
       cols="12"
        sm="2"
        md="2"
      >
        <v-select
        v-model="search.client_id"
            label="cliente"
            :items="clients"
        ></v-select>
      </v-col>
      <v-col
       cols="12"
        sm="2"
        md="2"
      >
        <v-text-field
        v-model="search.date"
            label="fecha"
            type="date"
        ></v-text-field>
      </v-col>
      <v-col
       cols="12"
        sm="2"
        md="2"
      >
      <v-radio-group
      v-model="fechas"
      >
      <v-radio
      
        label="Fecha inicial"
        value="fecha_inicial"
      ></v-radio>
      <v-radio
     
        label="Fecha final"
        value="fecha_final"
      ></v-radio>
    </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
         <v-col
         cols="12"
         sm="2"
         md="2"
        >
         <v-btn
           depressed
           color="primary"
           v-on:click='searchData'
         >
          Buscar
        </v-btn>
        </v-col>
        <v-col
         cols="12"
         sm="2"
         md="2"
        >
         <v-btn
           depressed
           color="secondary"
           v-on:click='clearData'
         >
           <v-icon dark>
           mdi-eraser
         </v-icon>          
         </v-btn>
         </v-col>
         <v-col
          cols="12"
          sm="2"
          md="2"
        >
         <v-btn
           depressed
           color="teal"
           v-on:click='report(transactions)'
         >
         <v-icon dark>
          mdi-microsoft-excel
        </v-icon>
        </v-btn>
        </v-col>
    </v-row>
  </v-card-text>
    <v-data-table
    :headers="headers"
    :items="transactions"
    class="elevation-1"
  >
    
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Administrar Transacciones</v-toolbar-title>
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
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle}}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row >
                  <v-col 
                  cols="12"
                    sm="12"
                    md="12"
                  >
                  <template v-if="editedIndex> -1">
                    <ul>
                     <li> Ubicacion:{{editedItem.parking_lot.lote}}</li>
               
                     <li> Cliente:{{editedItem.client.name}}</li>
                     <li> Placa o serial:{{editedItem.vehicle.plate}}</li>
                    </ul>
                  </template>
                  </v-col>
                 <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.time_start"
                      type="time"
                      label="Hora Inicio"
                    ></v-text-field>
                  </v-col>    
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.date_start"
                      type="date"
                      label="Hora Inicio"
                    ></v-text-field>
                  </v-col>    
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.time_stop"
                      type="time"
                      label="Hora Final"
                    ></v-text-field>
                  </v-col> 
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.date_stop"
                      type="date"
                      label="Hora Final"
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
            <v-card-title class="headline">¿Esta seguro que desea eliminar esta transaccion?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogBill" max-width="500px">
          <v-card>
            <template v-if="editedItem.bill==null">
            <v-card-title class="headline">¿Esta seguro de generar una factura para esta transaccion?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeBill">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="confirmBill">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
            </template>
            <template v-else>
              <v-card-title class="headline">La transaccion actual ya tiene factura</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeBill">Aceptar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
            </template>
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
      <template v-if="item.time_stop!=null">
       <v-icon
        small
        class="mr-2"
        @click="billItem(item)"
      >
        mdi-text-box-check
      </v-icon>
      </template>
      <template v-if="item.bill!==null">
         <v-icon
        small
        class="mr-2"
        @click="printBill(item)"
      >
        mdi-printer
      </v-icon>

      </template>
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
        Reset
      </v-btn>
    </template>
  </v-data-table>
  </v-card>
</template>
<script>
  import moment from 'moment';
  export default {
   
    data: () => ({
      dialog: false,
      dialogDelete: false,
      dialogBill: false,
      fechas: null,
      config:{
           headers:{
              'Authorization':'Bearer '+localStorage.access_token,
              'Content-Type':'application/json',
              'Accept':'application/json'
             }
      },
      configExcel:{
           headers:{
              'Authorization':'Bearer '+localStorage.access_token,
              'Content-Type':'application/json',
              'Accept':'application/json'
             },
              responseType:'blob',
              dataType:'binary',
      },
      apiurl:process.env.MIX_API_URL,
      
      headers: [
        {
          text: 'Ubicacion',
          align: 'start',
          sortable: false,
          value: 'parking_lot.lote',
        },
        { text: 'Hora de Inicio', value: 'time_start' },
        { text: 'Fecha de Inicio', value: 'date_start' },
        { text: 'Hora Final', value: 'time_stop' },
        { text: 'Fecha Final', value: 'date_stop' },
        { text: 'Cliente', value: 'client.name' },
        { text: 'Vehiculo', value: 'vehicle.plate' },
        { text: 'Actions', value: 'actions', sortable: false },
        
      ],
      search: {
        parking_lot_id:'',
        client_id:'',
        date_start:'',
        date_stop:'',
        vehicle_id:'',
        date:'',
        type:'',
      },
      defaultSearch: {
        parking_lot_id:'',
        client_id:'',
        date_start:'',
        date_stop:'',
        vehicle_id:'',
        date:'',
        type:'',
      },
      
      type:'',
        types: [{'text':'automovil','value':'automovil'},
           {'text':'bicicleta','value':'bicicleta'},
           {'text':'moto','value':'moto'},
        ],
      clients: [],
      vehicles: [],
      parking_lots: [],
     transactions: [],
     data:[],
      editedIndex: -1,
      editedItem: {
        id:'',
        bill:null,
        time_stop:'',
        time_start:'',
        date_start:'',
        date_stop:'',
      },
      defaultItem: {
        id:'',
        bill:null,
        time_stop: '',
        time_start:'',
        date_start:'',
        date_stop:'', 
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? '' : 'Editar Transaccion'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        axios.get(this.apiurl+'api/transaction/list',this.config).
         then(response=>{
           if(response.data.status=="ok"){
             this.transactions=response.data.data
           }else{
             console.log(response)
           }
         }) 
         axios.get(this.apiurl+'api/client/options',this.config).
         then(response=>{
           if(response.data.status=="ok"){
             this.clients=response.data.data
           }else{
             console.log(response)
           }
         }) 
      },
      changeVehicle(type){
       axios.get(this.apiurl+'api/vehicle/options/'+type,this.config).
         then(response=>{
           if(response.data.status=="ok"){
             this.vehicles=response.data.data
           }else{
             console.log(response)
           }
         }) 
         axios.get(this.apiurl+'api/parking-lot/options-search/'+type,this.config).
         then(response=>{
           if(response.data.status=="ok"){
             this.parking_lots=response.data.data
           }else{
             console.log(response)
           }
         }) 
      },
      searchData(){
        if(this.fechas==='fecha_inicial'){
          this.search.date_start=this.search.date
        }
        if(this.fechas==='fecha_final'){
          this.search.date_stop=this.search.date

        }
        if(this.type!==''){
          this.search.type=this.type

        }
       axios.post(this.apiurl+'api/transaction/search',this.search,this.config)
       .then(response=>{
         if(response.data.status=="ok"){
            this.transactions=response.data.data
        }
        if(response.data.data.length==0){  
          this.$vToastify.error(response.data.message)
          }
       })
      },
      clearData(){
       this.search=this.defaultSearch
       this.type=''
       this.initialize()
      },
      report(list){
         var d = new Date();
         var date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
        axios.post(this.apiurl+'api/transaction/report',list,this.configExcel).
        then(response=>{
          const reportExcel=window.URL.createObjectURL(new Blob([response.data],{type: 'application/vnd.ms-excel'}))
           const openDocument=document.createElement('a')
           openDocument.href=reportExcel
           openDocument.setAttribute('list','report.xlsx')
           openDocument.download='reporte_'+date+'.xlsx'
           document.body.appendChild(openDocument)
           openDocument.click()
        })
         .catch(error=>{
           this.$vToastify.error('Ha ocurrido un error al exportar el archivo')
         })
        },
      editItem (item) {
          this.editedIndex = this.transactions.indexOf(item)
          this.editedItem = Object.assign({}, item) 
          this.dialog = true
      },
      billItem (item) {
          this.editedIndex = this.transactions.indexOf(item)
          this.editedItem = Object.assign({}, item)  
          this.dialogBill = true
      },
      deleteItem (item) {
        this.editedIndex = this.transactions.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
         axios.delete(this.apiurl+'api/tariff/destroy/'+this.editedItem.id,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message,' ');
               this.initialize()  
             }else{
               this.$vToastify.error(response.data.message, ' ')
             }
           })  
        this.tariffs.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeBill () {
        this.dialogBill = false
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

      confirmBill(){
        console.log(this.editedItem)
        this.editedItem.status='Pagada'
        axios.post(this.apiurl+'api/bill/store',this.editedItem,this.config)
        .then(response=>{
          if(response.data.status=='ok'){
            this.$vToastify.success(response.data.message,' ');
            this.editedItem.bill_id=response.data.data
            axios.put(this.apiurl+'api/transaction/update/'+this.editedItem.id,this.editedItem,this.config)
            .then(response=>{
            })
            .catch(error=>{
              this.$vToastify.error('Error al actualizar la informacion')
            })
            this.initialize()  
            this.closeBill()
         }else{
              this.$vToastify.error(response.data.message,' ')
         }
          
        });
      },
      printBill(){
       
      },

      save () {
        
        if (this.editedIndex > -1) {
           
           axios.put(this.apiurl+'api/transaction/update/'+this.editedItem.id,this.editedItem,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               axios.put(this.apiurl+'api/parking-lot/status-free/'+this.editedItem.parking_lot_id,'',this.config)
               .then(response=>{
                   if(response.data.status=='ok'){
                     this.$vToastify.success(response.data.message,' ');
                     this.initialize()  
                     this.close()
                    }else{
                       this.$vToastify.error(response.data.message,' ')
                    }
               });
             }else{
               this.$vToastify.error(response.data.message,' ')
             }
           });
        } 
           
        
      },
    
    },
  }
</script>