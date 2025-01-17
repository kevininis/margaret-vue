<template>
    <!-- <Button label="Primary" raised @click="ListaBebidas()" /> -->

    <br>
    <br>
    <br>

    <div class="grid">
        <div class="card col-6">
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
                :value="products"
                dataKey="idBebida"
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

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="idBebida" header="No." sortable style="min-width: 4rem"></Column>
                <Column field="nombreBebida" header="Nombre" sortable style="min-width: 10rem"></Column>
                <Column field="descripcionBebida" header="Descripción" sortable style="min-width: 20rem"></Column>
                <Column field="precioBebida" header="Precio" sortable style="min-width: 10rem">
                    <template #body="products">
                        {{ formatCurrency(parseFloat(products.data.precioBebida)) }}
                    </template>
                </Column>
                <Column field="categorias.nombreCategoria" header="Categoria" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="products">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(products.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(products.data)" />
                    </template>
                </Column>
        </DataTable>


        <!-- MODAL DE NUEVO PRODUCTO -->
        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Nuevo Producto" :modal="true">
            <div class="flex flex-col gap-6">
                <div> 
                    <label for="Nombre" class="block font-bold mb-3">Nombre</label>
                    <InputText id="name" v-model="product.name" required="true" autofocus :invalid="submitted && !product.name" fluid />
                    <small v-if="submitted && !product.name" class="text-red-500">El nombre es obligatorio.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="categoria" class="block font-bold mb-3">Categorías</label>
                    <Select id="categoria" v-model="product.category" :options="categories" optionValue="idCategoria" optionLabel="nombreCategoria" placeholder="Selecciona una categoría" required="true" :invalid="submitted && !product.category" fluid checkmark ></Select>
                    <small v-if="submitted && !product.category" class="text-red-500">La categoría es obligatoria.</small>
                </div>
                <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Precio</label>
                        <InputNumber id="price" v-model="product.price" mode="currency" currency="GTQ" locale="es-GT" required="true" :invalid="submitted && !product.price" fluid />
                        <small v-if="submitted && !product.price" class="text-red-500">El precio es obligatorio.</small>    
                </div>
                
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog()" />
                <Button label="Guardar" icon="pi pi-check" @click="GuardarProducto()" />
            </template>
        </Dialog>
    </div>
</template>


<script>

export default {
    
    data () {
        return {
            submitted: false,
            products : null,
            product : {},
            filtros : {},
            productosSeleccionados : null,
            productDialog : false,
            categories : null,
        }
    },
    created() {
        this.initFilters();
    },
    mounted() {
        this.ListaBebidas();
        this.ListaCategorias();
    },
    methods: {
        ListaBebidas () {
            this.axios.get('listaBebidas')
            .then((response) => {
                if (response.status == 200) {
                    this.products = response.data.ListaBebidas
                }
            })
        },
        ListaCategorias () {
            this.axios.get('listaCategorias')
            .then((response) => {
                if (response.status == 200) {
                    this.categories = response.data.ListaCategorias
                }
            })
        },
        AbrirNueva () {
            this.product = {};
            this.submitted = false;
            this.productDialog = true;
        },  
        hideDialog() {
            this.productDialog = false;
            this.submitted = false;
        },
        GuardarProducto () {
            this.submitted = true;
            if (this.product?.name && this.product?.category) {
                
                this.axios.post('nuevaBebida', this.product)
                .then((response) => {
                    if (response.status == 200) {
                        this.$toast.add({ 
                            severity: 'success', 
                            summary: 'Operación exitosa', 
                            detail: response.data.message, 
                            life: 3000 
                        });
                        this.productDialog = false;
                        this.product = {};
                        this.ListaBebidas();
                    }
                })
            }
        },
        formatCurrency(value) {
            if(value)
				return value.toLocaleString('es-GT', {style: 'currency', currency: 'GTQ'});
			return;
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