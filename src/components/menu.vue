<template>
    <h1>este es el menú</h1>

    <Button label="Cambiar Color" @click="toggleDarkMode()" />
</template>

<script>

export default {

    data () {
        return {

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
            
        }

    }
}

</script>