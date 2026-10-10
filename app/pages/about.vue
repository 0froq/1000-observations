<script setup lang="ts">
const { t } = useI18n()
const copy = useCopy()

useHead({ title: () => t('obs.aboutTitle') })
</script>

<template>
  <Sheet
    line
    class="about-page"
  >
    <PageHead
      class="is-fit"
      long
      :kicker="copy('obs.kicker')"
      kicker-name="obs.kicker"
      :title="copy('obs.aboutTitle')"
      title-name="obs.aboutTitle"
      :lede="copy('obs.aboutLede')"
      lede-name="obs.aboutLede"
    />
    <section class="l-section is-prose about-copy">
      <div class="l-body l-prose">
        <p>{{ t('obs.aboutP1') }}</p>
        <p>{{ t('obs.aboutP2') }}</p>
        <p>{{ t('obs.aboutP3') }}</p>
      </div>
    </section>
  </Sheet>
</template>
