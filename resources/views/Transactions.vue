<template>
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
                  <template v-if="editedIndex> -1">
                <small>{{editedItem.parking_lot.lote}}</small>
               
                  <small>{{editedItem.client.name}}</small>
                  <small>{{editedItem.vehicle.plate}}</small>
                  
                  </template>
                 <v-col
                    cols="12"
                    sm="6"
                    md="4"
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
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.time_stop"
                      type="time"
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
            <v-card-title class="headline">¿Esta seguro que desea eliminar esta tarifa?</v-card-title>
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
            <v-card-title class="headline">¿Esta seguro de generar una factura para esta transaccion?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeBill">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="confirmBill">OK</v-btn>
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
</template>
<script>
  export default {
   
    data: () => ({
      dialog: false,
      dialogDelete: false,
      dialogBill: false,
      config:{
           headers:{
              'Authorization':'Bearer '+localStorage.access_token,
              'Content-Type':'application/json',
              'Accept':'application/json'
             }
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
        { text: 'Hora Final', value: 'time_stop' },
        { text: 'Cliente', value: 'client.name' },
        { text: 'Vehiculo', value: 'vehicle.plate' },
        { text: 'Fecha', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
     transactions: [],
     data:[],
      editedIndex: -1,
      editedItem: {
        id:'',
        time_stop:'',
        time_start:'',
      },
      defaultItem: {
        id:'',
        time_stop: '',
        time_start:'',
      
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
               this.$$vToastify.error(response.data.message, ' ')
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