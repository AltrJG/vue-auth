<template>
  <div class="container">
    <AppNavbar/>
      <!-- ////////// formulario Añadir ////////// -->
    <!-- Nombre -->
  <div class="container my-4">
  <form>  
    <div class="input-group mb-3">
    <span class="input-group-text">Nombre</span>
    <input v-model="usuario.nombre" type="text" class="form-control">
    </div>
    <!-- Correo -->
    <div class="input-group mb-3">
    <span class="input-group-text">Correo</span>
    <input v-model="usuario.correo" type="text" class="form-control">
    </div>
    <div class="input-group my-3">
      <input type="file" @change="buscarImagen($event)">
    </div>

      <div class="mt-3">  
    <button v-show="this.editar === true" 
      @click.prevent="actualizarDato(id)" 
      class="btn btn-primary">
      Actualizar
    </button>
    <button v-show="this.editar === false" 
      @click.prevent="agregarDato()" 
      class="btn btn-primary">
      Guardar
    </button>
    <div class="mt-4">
      <img :src="datoImagen">
    </div>

    </div>
  </form>
  </div>
<!-- ////////// tabla ////////// -->
  <table class="table">
    <thead>
      <tr>
        <th scope="col">id</th>
        <th scope="col">Nombre</th>
        <th scope="col">Correo</th>
        <th scope="col">Editar</th>
        <th scope="col">Eliminar</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in usuarios" :key="index">
        <th scope="row">{{index}}</th>
        <td>{{item.nombre}}</td>
        <td>{{item.correo}}</td> 
        <td>
          <button @click.prevent="obtenerDatoID( item.id );this.editar = !this.editar;" 
            class="btn btn-primary">Editar
          </button>
        </td>

        <td>
          <button @click.prevent="eliminarDato(item.id)" 
            class="btn btn-danger">Eliminar
          </button>
      </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc  } from 'firebase/firestore/lite';
import { db, storage } from "../main";
import firebase from 'firebase/compat/app';
import router from '../router/index'

export default {
  name: 'AppAbout',
  components: {
    AppNavbar
  },
  data() {
    return {
      file: null,
      datoImagen: null,
      error: null,
      editar: false,
      loading: false,

      usuarios: [],
      usuario: {
      nombre: '',
      correo: '',
      foto: ''
    }
  }
  },
  methods: {
    async obtenerDatos () { 
      const querySnapshot = await getDocs(collection(db, "usuarios"));
        querySnapshot.forEach((doc) => {
        let usuario = doc.data()
        usuario.id = doc.id
        this.usuarios.push(usuario)
        console.log(usuario)
      });
    },
    // DELETE / ELIMINAR / BORRAR
    async eliminarDato (id){
      await deleteDoc(doc(db, "usuarios", id ));
      router.go('/')
    },
    // GET BY ID / OBTENER POR ID
    async obtenerDatoID (id){
      const docRef = doc(db, "usuarios", id);
      const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            this.usuario = docSnap.data()
            this.usuario.id = docSnap.id
            } 
            else {
            console.log("¡No existe el documento!");
            }
    },

     // BUSCAR IMAGEN
    buscarImagen(event){
      const tipoArchivo = event.target.files[0].type;
      if(tipoArchivo === 'image/jpeg' || tipoArchivo === 'image/png'){
          this.file = event.target.files[0]
          this.error = null
      }
          else{
          this.error = 'Archivo no válido'
          this.file = null
          return 
          }
          const reader = new FileReader();
          reader.readAsDataURL(this.file);
          reader.onload = (e) => {
          this.datoImagen = e.target.result
          }
    },
    // SUBIR IMAGEN STORAGE
  async agregarDato(){
    try {
     this.loading = true
      var storageRef = storage.ref();
      await storageRef.child('imagenes').child(this.file.name).put(this.file)
      const urlDescarga = await storageRef.child('imagenes').child(this.file.name).getDownloadURL()
      await addDoc(collection(db, "usuarios"), {
          nombre: this.usuario.nombre,
          correo: this.usuario.correo,
          foto: urlDescarga
        })
        this.error = 'Imagen subida con éxito'
        this.file = null
    } 
      catch (error) {
        console.log(error);
      } 
      finally {
        router.push('/')
        this.loading = false
      }
    },

// MÉTODO actualizarDato
async actualizarDato(){
    try {
      this.loading = true
      var storageRef = firebase.storage().ref();
      await storageRef.child('imagenes').child(this.file.name).put(this.file)
      const urlDescarga = await storageRef.child('imagenes').child(this.file.name).getDownloadURL()
      const elemento = doc(db, "usuarios", this.usuario.id )
      await updateDoc(elemento, {
          nombre: this.usuario.nombre,
          correo: this.usuario.correo,
          foto: urlDescarga
        })
        this.error = 'Imagen subida con éxito'
        this.file = null
    } 
      catch (error) {
        console.log(error);
      } 
      finally {
        router.push('/')
        this.loading = false
      }}
  },
  mounted() {
    this.obtenerDatos();
  },
}

</script>