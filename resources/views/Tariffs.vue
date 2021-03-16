<template>
  <v-data-table
    :headers="headers"
    :items="tariffs"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Administrar Tarifas</v-toolbar-title>
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
              Nuevo Tarifa
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
                    <v-text-field
                      v-model="editedItem.value_minute"
                      label="Valor Minuto"
                    ></v-text-field>
                  </v-col>    
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.value_hour"
                      label="Valor Hora"
                    ></v-text-field>
                  </v-col>    
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.discount"
                      label="Descuento"
                    ></v-text-field>
                  </v-col> 
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.condition"
                      label="Condicion"
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
    components:{
   
    },
    data: () => ({
      dialog: false,
      dialogDelete: false,
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
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Valor Minuto', value: 'value_minute' },
        { text: 'Valor Hora', value: 'value_hour' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
     tariffs: [],
      editedIndex: -1,
      editedItem: {
        id:'',
        name: '',
        value_minute: 0,
        value_hour: 0,
        discount:0,
        condition:0
      },
      defaultItem: {
        id:'',
        name: '',
        value_minute: 0,
        value_hour: 0,
        discount:0,
        condition:0
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Tarifa' : 'Editar Tarifa'
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
        axios.get(this.apiurl+'api/tariff/list',this.config).
         then(response=>{
           if(response.data.status=="ok"){
             this.tariffs=response.data.data
             
             
           }else{
             console.log(response)
           }
         }) 
      },
      
      editItem (item) {
          this.editedIndex = this.tariffs.indexOf(item)
        this.editedItem = Object.assign({}, item)  
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.tariffs.indexOf(item)
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

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
         
           axios.put(this.apiurl+'api/tariff/update/'+this.editedItem.id,this.editedItem,this.config)
           .then(response=>{
             if(response.data.status=='ok'){
               this.$vToastify.success(response.data.message,' ');
               this.initialize()  
             }else{
               this.$$vToastify.error(response.data.message,' ')
             }
           })  
        } else {
           axios.post(this.apiurl+'api/tariff/store',this.editedItem,this.config)
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