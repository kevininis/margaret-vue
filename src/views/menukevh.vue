<template>
    <div class="card">
        <Menubar :model="NavBarItems" >
            <template #start>
                <img src="../assets/img/logo margaret.png" alt="Logo Margaret" width="55" height="40" viewBox="0 0 35 40" fill="none" class="h-8">
            </template>
            <template #item="{item, props, hasSubmenu}">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
                </a>
            </template>          
            
            <template #end>
                <div class="flex items-center gap-2">
                    <Button label="Cambiar Color" @click="toggleDarkMode()" />
                    <Button label="Cerrar sesión" severity="secondary" />
                </div>
            </template>
        </Menubar>
    </div>


    <!-- TAMBIÉN FUNCIONAN COMO ROUTER-LINK -->
    <!-- <Button as="router-link" label="router" to="/bebidas"></Button> -->


</template>

<script>

export default {
    data () {
        return {
            NavBarItems : [
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
                    //         life: 3000 
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
    },
    mounted () {
        this.setDarkMode();
    },
    methods : {
        setDarkMode () {
            if (localStorage.getItem('darkTheme') == null){
                localStorage.setItem("darkTheme", false);
            };
            if (localStorage.getItem('darkTheme') == 'true') {
                document.documentElement.classList.toggle('my-app-dark');
            }
        },

        toggleDarkMode () {
            let dark = localStorage.getItem('darkTheme')

            if (dark == 'false') {
                document.documentElement.classList.toggle('my-app-dark');
                localStorage.removeItem("darkTheme");
                localStorage.setItem("darkTheme", true);
                console.log('entra al if')
                
            } else {
                document.documentElement.classList.toggle('my-app-dark');
                localStorage.removeItem("darkTheme");
                localStorage.setItem("darkTheme", false);
                console.log('entra al else')
            }   
            console.log(dark)
            
        },
        

    }
}

</script>