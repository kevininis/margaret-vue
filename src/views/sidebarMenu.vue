<template>
    <Menu :model="SidebarItems" />
</template>

<script>
export default {
    data () {
        return {
            SidebarItems : [
                {
                    label: 'Inicio',
                    icon : 'pi pi-home',
                    route : '/',
                    // PRUEBA DE TOAST
                    // command : () => {
                    //     this.$toast.add({ 
                    //         severity: 'success', 
                    //         summary: 'Operación exitosa', 
                    //         detail: 'Prueba de toast', 
                    //         life: 3000 ññ
                    //     });
                    // }
                },
                {
                    label : 'Bebidas',
                    route : '/bebidas'
                },
                {
                    label : 'otro',
                    icon : 'pi pi-home',
                    items : [
                        {   
                            label : 'Uno',
                            url : 'http://google.com'
                        },
                        {
                            label : 'bebidasDos',
                            commad : () => {
                                this.$router.push('/bebidas');
                            }
                        }
                    ]
                }
            ]
        
        }
    }
}
</script>