<script setup lang="ts">
const route = useRoute()
const link = useKitLink()

await navigateTo(link(`/s/${String(route.params.id)}`), { redirectCode: 301 })
</script>
