<script setup lang="ts">
const { t } = useI18n()
const copy = useCopy()

useHead({ title: () => t('obs.aboutTitle') })
</script>

<template>
  <Sheet line>
    <PageHead
      :kicker="copy('obs.kicker')"
      kicker-name="obs.kicker"
      :title="copy('obs.aboutTitle')"
      title-name="obs.aboutTitle"
      :lede="copy('obs.aboutLede')"
      lede-name="obs.aboutLede"
      compact
    />
    <section class="l-section is-prose">
      <div class="l-body l-prose">
        <p>{{ t('obs.aboutPlaceholder') }}</p>
      </div>
    </section>
  </Sheet>
</template>
