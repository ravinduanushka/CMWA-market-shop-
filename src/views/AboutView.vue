<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const fullText = `Welcome to CMWA Marketing Store, your ultimate destination for a seamless and enjoyable shopping experience. Discover a wide range of quality products, exciting offers, and exclusive deals designed to meet your everyday needs. We are committed to providing reliable service, convenient shopping, and the best products all in one place. Explore, choose, and enjoy a smarter way to shop with CMWA Marketing Store.`

const displayedText = ref('')
const contactRef = ref<HTMLElement | null>(null)
const isContactVisible = ref(false)

let currentIndex = 0
let timer: number | null = null
let observer: IntersectionObserver | null = null

function runForwardTypewriter() {
  if (currentIndex < fullText.length) {
    // Type forward at a relaxed, smooth speed (45ms per letter)
    displayedText.value += fullText.charAt(currentIndex)
    currentIndex++
    timer = window.setTimeout(runForwardTypewriter, 45)
  } else {
    // Reached the end: pause 4 seconds so user can comfortably read
    timer = window.setTimeout(() => {
      // Instantly reset (no backward letter erasing) and start typing again from 0
      displayedText.value = ''
      currentIndex = 0
      timer = window.setTimeout(runForwardTypewriter, 500)
    }, 4000)
  }
}

onMounted(() => {
  // Start typewriter loop
  currentIndex = 0
  displayedText.value = ''
  runForwardTypewriter()

  // Intersection observer for scroll animation of Contact Us section
  if (contactRef.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isContactVisible.value = true
            if (contactRef.value && observer) {
              observer.unobserve(contactRef.value)
            }
          }
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(contactRef.value)
  } else {
    isContactVisible.value = true
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (observer && contactRef.value) {
    observer.unobserve(contactRef.value)
    observer.disconnect()
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
    
    <!-- Back to Home Navigation Link -->
    <div>
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-text-muted dark:text-text-muted-dark hover:text-primary transition-colors font-semibold text-sm hover:-translate-x-1 duration-200"
      >
        <span>←</span> Back to Home
      </RouterLink>
    </div>

    <!-- Part 1: Description Section with Typewriter in Rectangle Box -->
    <section class="transition-all duration-300">
      <div class="p-6 sm:p-8 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm min-h-[160px]">
        <p class="text-lg sm:text-xl text-text dark:text-text-dark leading-relaxed font-semibold tracking-wide">
          {{ displayedText }}
          <span class="inline-block w-2.5 h-6 bg-primary ml-1 rounded-sm animate-pulse align-middle shadow-sm"></span>
        </p>
      </div>
    </section>

    <!-- Part 2: Contact Us Section with Transparent Bordered Cards -->
    <section
      ref="contactRef"
      class="transform-gpu transition-all duration-700 ease-out"
      :class="[
        isContactVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-16 scale-95 pointer-events-none'
      ]"
    >
      <div class="space-y-6">
        <div class="border-b-2 border-primary/40 dark:border-border-dark pb-4">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-text dark:text-text-dark">Contact Us</h2>
        </div>

        <!-- Contact Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Email Box -->
          <a
            href="mailto:info@CMWAmarketingstore.com"
            class="group p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md block"
          >
            <div>
              <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Email Us</p>
              <p class="font-extrabold text-text dark:text-text-dark group-hover:text-primary transition-colors text-base sm:text-lg break-all">
                info@CMWAmarketingstore.com
              </p>
            </div>
          </a>

          <!-- Phone Box -->
          <a
            href="tel:+94771234567"
            class="group p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md block"
          >
            <div>
              <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Call Us</p>
              <p class="font-extrabold text-text dark:text-text-dark group-hover:text-primary transition-colors text-base sm:text-lg">
                +94 77 123 4567
              </p>
            </div>
          </a>

          <!-- Location Box -->
          <div class="p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm block">
            <div>
              <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Store Address</p>
              <p class="font-extrabold text-text dark:text-text-dark text-base sm:text-lg">
                CMWA Marketing Headquarters, Sri Lanka
              </p>
            </div>
          </div>

          <!-- Hours Box -->
          <div class="p-6 rounded-2xl border-2 border-primary/40 dark:border-border-dark shadow-sm block">
            <div>
              <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Business Hours</p>
              <p class="font-extrabold text-text dark:text-text-dark text-base sm:text-lg">
                Mon - Sun: 8:00 AM - 10:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
