<template>
  <v-data-table
  hide-default-footer
   class="elevation-1"
  >
  <template>
    
  </template>
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Administrar Parqueadero</v-toolbar-title>
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
              Nuevo Estacionamiento
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
                      v-model="editedItem.lote"
                      label="lote"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  <v-select
                     v-model="editedItem.type_vehicle"
                     :items="types"
                     label="tipo de vehiculo"
                  ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  <v-select
                     v-model="editedItem.status"
                     :items="statuses"
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">¿Esta seguro que desea eliminar este estacionamiento?</v-card-title>
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
    
    <template v-slot:no-data>
       <v-row class="col-12">
        <v-card-title class="col-12">
          <span class="headline"> Automoviles</span>
        </v-card-title>
        <v-row class="col-12">
          <template v-for="(automovil, index) in automoviles">
            <template v-if="automovil.status=='libre'">
              <v-card class="col-1" :key="index" color='green'>
                {{automovil.lote}}
                <template>
                   <v-icon color="white"
                     small  
                     class="d-inline"
                     @click="editItem(automovil,'auto')"
                   >
                      mdi-pencil
                  </v-icon>
                 <v-icon color="white"
                     small
                     class="d-inline"
                    @click="deleteItem(automovil,'auto')"
                   >
                     mdi-delete
                  </v-icon>
               </template>
              </v-card >
            </template>
            <template v-else>
              <v-card class="col-1" :key="index" color='red'>
                {{automovil.lote}}
                <template>
                   <v-icon color="white"
                     small  
                     class="d-inline"
                     @click="editItem(automovil,'auto')"
                   >
                      mdi-pencil
                  </v-icon>
                 <v-icon color="white"
                     small
                     class="d-inline"
                    @click="deleteItem(automovil,'auto')"
                   >
                     mdi-delete
                  </v-icon>
               </template>
              </v-card >
            </template>
          </template>
        </v-row>
       </v-row>
       <v-row class="col-12">
        <v-card-title class="col-12">
          <span class="headline"> Bicicletas</span>
        </v-card-title>
        <v-row class="col-12">
          <template v-for="(bicicleta, index) in bicicletas">
            <template v-if="bicicleta.status=='libre'">
              <v-card class="col-1" :key="index" color='green'>
                {{bicicleta.lote}}
                <template>
                   <v-icon color="white"
                     small  
                     class="d-inline"
                     @click="editItem(bicicleta,'bici')"
                   >
                      mdi-pencil
                  </v-icon>
                 <v-icon color="white"
                     small
                     class="d-inline"
                    @click="deleteItem(bicicleta,'bici')"
                   >
                     mdi-delete
                  </v-icon>
               </template>
              </v-card >
            </template>
            <template v-else>
              <v-card class="col-1" :key="index" color='red'>
                {{bicicleta.lote}}
                <template>
                   <v-icon color="white"
                     small  
                     class="d-inline"
                     @click="editItem(bicicleta,'bici')"
                   >
                      mdi-pencil
                  </v-icon>
                 <v-icon color="white"
                     small
                     class="d-inline"
                    @click="deleteItem(bicicleta,'bici')"
                   >
                     mdi-delete
                  </v-icon>
               </template>
              </v-card >
            </template>
          </template>
        </v-row>
       </v-row>
       <v-row class="col-12">
        <v-card-title class="col-12">
          <span class="headline"> Motos</span>
        </v-card-title>
        <v-row class="col-12">
          <template v-for="(moto, index) in motos">
            <template v-if="moto.status=='libre'">
              <v-card class="col-1" :key="index" color='green'>
                {{moto.lote}}
                <template>
                   <v-icon color="white"
                     small  
                     class="d-inline"
                     @click="editItem(moto,'moto')"
                   >
                      mdi-pencil
                  </v-icon>
                 <v-icon color="white"
                     small
                     class="d-inline"
                    @click="deleteItem(moto,'moto')"
                   >
                     mdi-delete
                  </v-icon>
               </template>
              </v-card >
            </template>
            <template v-else>
              <v-card class="col-1" :key="index" color='red'>
                {{moto.lote}}
                <template>
                   <v-icon color="white"
                     small  
                     class="d-inline"
                     @click="editItem(moto,'moto')"
                   >
                      mdi-pencil
                  </v-icon>
                 <v-icon color="white"
                     small
                     class="d-inline"
                    @click="deleteItem(moto,'moto')"
                   >
                     mdi-delete
                  </v-icon>
               </template>
              </v-card >
            </template>
          </template>
        </v-row>
       </v-row>   
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
      types:[
          {text:'automovil',value:'automovil'},
          {text:'bicicleta',value:'bicicleta'},
          {text:'moto',value:'moto'},
      ],
     statuses:[
          {text:'libre',value:'libre'},
          {text:'ocupado',value:'ocupado'},
     ],
     automoviles:[],
     bicicletas:[],
     motos:[],

      editedIndex: -1,
      editedItem: {
        id:'',
        lote: '',
        type_vehicle:'' ,
        status:'',

      },
      defaultItem: {
        id:'',
        lote: '',
        type_vehicle:'',
        status: ''
      },
      
    }),
   
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Estacionamiento' : 'Editar Estacionamiento'
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
        axios.get(this.apiurl+'api/parking-lot/list',this.config).
         then(response=>{
           if(response.data.status=="ok"){
             this.automoviles=response.data.data.automovil
             this.bicicletas=response.data.data.bicicleta
             this.motos=response.data.data.moto
               
           }else{
             console.log(response)
           }
         }) 
         
      },
      
      editItem (item,origen) {
        switch(origen){
          case 'auto':
            this.editedIndex = this.automoviles.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            break;
          case 'bici':
            this.editedIndex = this.bicicletas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            break;
          case 'moto':
            this.editedIndex = this.motos.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            break;
        }
        
      },
       
      deleteItem (item,origen) {
        switch(origen){
          case 'auto':
            this.editedIndex = this.automoviles.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            break;
          case 'bici':
            this.editedIndex = this.bicicletas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            break;
          case 'moto':
            this.editedIndex = this.motos.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            break;
        }
       
      },

      deleteItemConfirm () {
         axios.delete(this.apiurl+'api/parking-lot/destroy/'+this.editedItem.id,this.config)
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
      
      save () {
        switch(this.editedItem.type_vehicle){
              case 'automovil':
              this.editedItem.lote='A '+ this.editedItem.lote
              break;
              case 'bicicleta':
                this.editedItem.lote='B '+ this.editedItem.lote
                break;
               case 'moto':
                 this.editedItem.lote='M'+ this.editedItem.lote 
                 break;
            }
        if (this.editedIndex > -1) {
            
           axios.put(this.apiurl+'api/parking-lot/update/'+this.editedItem.id,this.editedItem,this.config)
           .then(response=>{
             if(response.data.status=='ok'){    
               this.$vToastify.success(response.data.message,' ');
               this.initialize()  
             }else{
               this.$$vToastify.error(response.data.message,' ')
             }
           })  
        } else {
           axios.post(this.apiurl+'api/parking-lot/store',this.editedItem,this.config)
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