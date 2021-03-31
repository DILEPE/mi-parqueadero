<template>
  <v-data-table
    :headers="headers"
    :items="bills"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Administrar Facturas</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
            <p
              class="mb-2"
            >
            <b>Total Pagado:</b>
            {{suma}}
            </p>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
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
                    md="6"
                  >
                  <v-select
                     v-model="editedItem.status"
                     :items="types"
                     label="Estado"
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
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Actualizar
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
  export default {
    components:{
   
    },
    data: () => ({
      dialog: false,
      suma:'',
      config:{
           headers:{
              'Authorization':'Bearer '+localStorage.access_token,
              'Content-Type':'application/json',
              'Accept':'application/json'
             }
      },
      apiurl:process.env.MIX_API_URL,
      types:[
          {text:'Anulada',value:'Anulada'},
          {text:'Activa',value:'Activa'},
          {text:'Pagada',value:'Pagada'},
      ],
     
      headers: [
        {
          text: 'Numero Factura',
          align: 'start',
          value: 'id'
        },
        { text: 'Ubicacion', value: 'parking_lot.lote' },
        { text: 'Vehiculo', value: 'vehicle.plate' },
        { text: 'Cliente', value: 'client.document' },
        { text:'Estado',value:'status'},
        { text: 'Valor Total', value: 'value' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
     bills: [],
      editedIndex: -1,
      editedItem: {
        id:'',
        status:''
      },
      defaultItem: {
        id:'',
       status:''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? '':'Editar Factura'
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
        axios.get(this.apiurl+'api/bill/list',this.config).
         then(response=>{
           if(response.data.status=="ok"){
             this.bills=response.data.data
             this.suma=response.data.suma
           }else{
             console.log(response)
           }
         }) 
      },
      
      editItem (item) {
          this.editedIndex = this.bills.indexOf(item)
        this.editedItem = Object.assign({}, item)  
        this.dialog = true
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

        save () {
        if (this.editedIndex > -1) {
           axios.put(this.apiurl+'api/bill/update/'+this.editedItem.id,this.editedItem,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message, ' ');
               this.initialize()  
             }else{
               this.$$vToastify.error(response.data.message,' ')
             }
             
           })
          
        }
        this.close()
      },
    },
  }
</script>