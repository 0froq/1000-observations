<script setup lang="ts">
const link = useKitLink()

await navigateTo(link('/'), { redirectCode: 301 })
</script>
