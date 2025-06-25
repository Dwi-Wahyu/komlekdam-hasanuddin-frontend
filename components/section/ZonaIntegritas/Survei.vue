<template>
  <div class="p-5 sm:px-32">
    <WidgetsJudulSection text="Survei" />
    <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-10 gap-5">
      <div class="flex flex-col gap-2 items-center">
        <h1 class="font-semibold mb-2 text-lg">Survei SPKP</h1>
        <p>
          Survei pelayanan publik ini bertujuan untuk meningkatkan kinerja
          satuan. Hasil survei ini akan digunakan sebagai dasar perbaikan
          berkala, dengan jaminan kerahasiaan informasi responden. Responden
          diharapkan memberikan jawaban jujur, dan data hanya digunakan untuk
          keperluan survei
        </p>
        <WidgetsButtonBaseButton
          class="mt-3 border-yellow text-yellow"
          variant="outline"
          @click="
            navigateTo(
              'https://docs.google.com/forms/d/e/1FAIpQLSfpeUqp4VG7FAe3aBFJgLzhIU25AXmZx2G6UfO4qKmAPQKHag/viewform?usp=dialog',
              {
                external: true,
              }
            )
          "
        >
          Isi Survei SPKP
        </WidgetsButtonBaseButton>
      </div>
      <div class="flex flex-col gap-2 items-center">
        <h1 class="font-semibold mb-2 text-lg">Survei SPAK</h1>
        <p>
          SPAK atau Survei Persepsi Anti Korupsi adalah survei yang dilakukan
          oleh satuan Hubdam XIV/Hsn untuk mencegah perilaku korupsi serta upaya
          lainnya yang bertujuan mengukur pemahaman dan kesadaran personel
          terhadap bahaya korupsi serta mengevaluasi efektivitas program
          pencegahan di satuan Hubdam XIV/Hsn
        </p>
        <WidgetsButtonBaseButton
          class="mt-3 border-yellow text-yellow"
          variant="outline"
          @click="
            navigateTo(
              'https://docs.google.com/forms/d/e/1FAIpQLSfOjK5WW53vuVJsdkAvZUL4LunitwV6p2oQDNYncbYMWC-JKA/viewform?usp=dialog',
              {
                external: true,
              }
            )
          "
          >Isi Survei SPAK
        </WidgetsButtonBaseButton>
      </div>
    </div>
  </div>
</template>
