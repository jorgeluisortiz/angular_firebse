import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Empleado';


  constructor(private fb: FormBuilder, 
    private _empleadoService: EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      departamento: ['', Validators.required],
      fecha: ['', Validators.required],
      precio: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id)
   }

  ngOnInit(): void {
    this.esEditar();

  }
  agregarEditarEmpleado(){
    this.submitted = true;
    if (this.createEmpleado.invalid) {
      return;
    } 
    if (this.id === null) {
      this.agregarEmpleado();
    } else {
      this.editarEmpleado(this.id);
    }


  }
agregarEmpleado(){
  const empleado: any = {
    nombre: this.createEmpleado.value.nombre,
    apellido: this.createEmpleado.value.apellido,
    fecha: this.createEmpleado.value.fecha,
    departamento: this.createEmpleado.value.departamento,
    precio: this.createEmpleado.value.precio,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),  
  }
  this.loading = true;
  this._empleadoService.agregarEmpleado(empleado).then(()=>{
    this.toastr.success("Registrado con exito","Arendatario")
    this.loading =false;
    this.router.navigate(['/list-empleados']);
  }).catch(error =>{
    console.log(error);
    this.loading =false;
    
  })
  
}
editarEmpleado(id: string) {

  const empleado: any = {
    nombre: this.createEmpleado.value.nombre,
    apellido: this.createEmpleado.value.apellido,
    fecha: this.createEmpleado.value.fecha,
    departamento: this.createEmpleado.value.departamento,
    precio: this.createEmpleado.value.precio,
  
    fechaActualizacion: new Date(),  
  }

  this.loading = true;

  this._empleadoService.actualizarEmpleado(id, empleado).then(() => {
    this.loading = false;
    this.toastr.info('Registro modificado con exito', 'Registro modificado')
    this.router.navigate(['/list-empleados']);
  })
}
  esEditar() {
    this.titulo = 'Editar Empleado'
    if (this.id !== null) {
      this.loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe(data => {
        this.loading = false;
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          departamento: data.payload.data()['departamento'],
          fecha: data.payload.data()['fecha'],
          precio: data.payload.data()['precio'],
        })
      })
    }
  }
}
