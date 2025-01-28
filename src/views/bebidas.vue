<template>
    <!-- <Button label="Primary" raised @click="ListaBebidas()" /> -->
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="AbrirNueva()" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected()"  />

                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>
        </div>
        <DataTable ref="dt"
                v-model:selection="selectProducts.selectedProducts"
                :value="products"
                dataKey="idBebida"
                :paginator="true"
                :rows="10"
                :filters="filtros"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} productos"
                :size="'small'"
                removableSort>


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


                <Column selectionMode="multiple" :exportable="false"></Column>
                <Column field="index" header="No." sortable>
                </Column>
                
                <Column field="nombreBebida" header="Nombre" sortable ></Column>
                <Column field="descripcionBebida" header="Descripción" sortable ></Column>
                <Column field="precioBebida" header="Precio" sortable >
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
                    <InputText id="name" v-model="product.name" required="true" autocomplete="off" autofocus :invalid="submitted && !product.name" fluid />
                    <small v-if="submitted && !product.name" class="text-red-500">El nombre es obligatorio.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="categoria" class="block font-bold mb-3">Categorías</label>
                    <Select id="categoria" v-model="product.category" :options="categories" optionValue="idCategoria" optionLabel="nombreCategoria" placeholder="Selecciona una categoría" required="true" :invalid="submitted && !product.category" fluid checkmark >
                        <template #footer>
                            <div class="p-3">
                                <Button label="Añadir nuevo" fluid severity="secondary" text size="small" icon="pi pi-plus" @click="openNewCategory()" />
                            </div>
                        </template>
                    </Select>
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
                <Button label="Guardar" icon="pi pi-check" @click="saveProduct()" />
            </template>
        </Dialog>

        <!-- MODAL AGREGAR NUEVA CATEGORIA -->
        <Dialog v-model:visible="newCategory">
            hola
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="cancelNewCategory()" />
                <Button label="Yes" icon="pi pi-check" />
            </template>
        </Dialog>

        <!-- MODAL DE CONFIRMA ELIMINAR UN PRODUCTO -->
        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product"
                    >¿Estas seguro que quieres eliminar <b>{{ product.nombreBebida }}</b
                    >?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <!-- MODAL DE CONFIRMAR ELIMINAR SELECCIONADOS -->
        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product"> ¿Estas seguro que quieres eliminar los productos seleccionados?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
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
            selectedProducts : null,
            productDialog : false,
            categories : null,
            deleteProductDialog : false,
            deleteProductsDialog : false,
            selectProducts : {
                selectedProducts : null
            },
            newCategory : false
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
                    this.products = response.data.ListaBebidas;

                    // AGREGAR LOS INDEX AL JSON
                    this.products.forEach(element => {
                        let getId = this.findIndexById(response, element.idBebida);           
                        this.products[getId].index = getId + 1;
                    });
                }
                    
            })
        },
        findIndexById(response, id) {
            // GET INDEX
            let index = 0;
            for (let i = 0; i < response.data.ListaBebidas.length; i++) {
                if (this.products[i].idBebida === id) {
                    index = i;
                    break
                }
            }

            return index;
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
            this.$toast.add({ severity: 'error',
                            summary: 'Cancelado',
                            detail: 'Se canceló agregar nueva bebida', 
                            life: 3000 });
        },
        openNewCategory () {
            this.newCategory = true;
            this.productDialog = false;
        },
        cancelNewCategory () {
            this.newCategory = false;
            this.productDialog = true;
        }, 
        saveNewCategory () {





            
        },
        saveProduct () {
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
        confirmDeleteProduct (value) {
            this.product = value;
            this.deleteProductDialog = true;
        },  
        deleteProduct () {
            this.axios.post('eliminarBebida', this.product)
            .then((response) => {
                if (response.status == 200) {
                    this.$toast.add({
                        severity:'success',
                        summary: 'Operación exitosa',
                        detail: response.data.message,
                        life: 3000});
                    this.ListaBebidas();
                }
            })

            this.deleteProductDialog = false;
            this.product = {};
        },
        confirmDeleteSelected () {
            this.deleteProductsDialog = true;
        },
        deleteSelectedProducts () {
            this.axios.post('eliminarBebidas', this.selectProducts)
            .then((response) => {
                if (response.status == 200) {
                    this.$toast.add({
                        severity : 'success',
                        summary : 'Operación exitosa',
                        detail : response.data.message,
                        life : 3000
                    });
                    this.ListaBebidas();
                }
            })
            .catch (err => {
                this.$toast.add({
                    severity : 'error',
                    summary : 'Operación fallida',
                    detail :  err,// response.data.message,
                    life : 3000
                })
                this.ListaBebidas();
                
            })
            this.deleteProductsDialog = false;
            this.selectedProducts = null;
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