<template>
    <!-- <Button label="Primary" raised @click="ListaBebidas()" /> -->

    <br>
    <br>
    <br>


    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="AbrirNueva()" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" outlined  />

                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>
        </div>
        <DataTable ref="dt"
                v-model:selection="productosSeleccionados"
                :value="productos"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filtros"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">


                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Buscar bebida</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filtros['global'].value" placeholder="Buscar..." />
                        </IconField>
                    </div>
                </template>
            
            
        </DataTable>

        <Dialog v-model:visible="NuevoProducto" :style="{ width: '450px' }" header="Nuevo Producto" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="Nombre" class="block font-bold mb-3">Nombre</label>
                    <InputText id="name" v-model.trim="producto.name" required="true" autofocus :invalid="submitted && !product.name" fluid />
                    <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" fluid />
                </div>


                <div>
                    <span class="block font-bold mb-4">Category</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category1" v-model="product.category" name="category" value="Accessories" />
                            <label for="category1">Accessories</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category2" v-model="product.category" name="category" value="Clothing" />
                            <label for="category2">Clothing</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category3" v-model="product.category" name="category" value="Electronics" />
                            <label for="category3">Electronics</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category4" v-model="product.category" name="category" value="Fitness" />
                            <label for="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Price</label>
                        <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Quantity</label>
                        <InputNumber id="quantity" v-model="product.quantity" integeronly fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="CerrarDialogo()" />
                <Button label="Save" icon="pi pi-check" @click="GuardarProducto()" />
            </template>
        </Dialog>
    </div>







<hr>


<!-- 
<DataTable :value="products" ref="dt" tableStyle="min-width: 50rem" >
    <template #header>
        <div class="text-end pb-4">
            <Button icon="pi pi-external-link" label="Export" @click="exportPDF($event)" />
        </div>
    </template>
    
    <Column field="idBebida" header="No." sortable ></Column>
    <Column field="nombreBebida" header="Nombre" sortable></Column>
    <Column field="descripcionBebida" header="Descripción" sortable></Column>
    <Column field="precioBebida" header="Precio" sortable></Column>
    <Column field="categorias.nombreCategoria" header="Categoria" sortable></Column>
</DataTable> -->
</template>


<script>

export default {
    
    data () {
        return {
            NuevoProducto: false,
            submitted: false,
            productos : null,
            producto : {},
            filtros : {},
            productosSeleccionados : null,
        }
    },
    created() {
        this.initFilters();
    },
    mounted() {
        this.ListaBebidas();
    },
    methods: {
        ListaBebidas () {
            this.axios.get('listaBebidas')
            .then((response) => {
                if (response.status == 200) {
                    this.products = response.data.ListaBebidas
                    console.log(response.data.ListaBebidas)
                }
            })
        },
        AbrirNueva () {
            this.product = {};
            this.submitted = false;
            this.NuevoProducto = true;
        },  
        CerrarDialogo() {
            this.NuevoProducto = false;
            this.submitted = false;
        },
        GuardarProducto () {

        },



        exportCSV () {
            this.$refs.dt.exportCSV();
        },
        initFilters() {
            this.filtros = {
                'global': {value: null},
            }
        },
    }
}

</script>