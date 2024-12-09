<script setup>

const canvas = ref(null)
let ctx
let animationFrameId
let stars = []
let fireworks = []

// 烟花粒子类
class Particle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.velocity = {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8
    }
    this.alpha = 1
    this.decay = Math.random() * 0.02 + 0.02
  }

  update() {
    this.velocity.y += 0.1
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.alpha -= this.decay
    return this.alpha > 0
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

const initStars = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.1,
    trail: [], // 用于存储星星轨迹的位置数组
    trailLength: Math.floor(Math.random() * 3) + 5 // 随机轨迹长度，范围在5-8之间
  }))
}

const createFirework = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const x = Math.random() * width
  const y = Math.random() * (height * 0.6) + height * 0.2
  const colors = ['#ff0', '#f0f', '#0ff', '#ff4', '#4ff']
  const color = colors[Math.floor(Math.random() * colors.length)]

  // 创建烟花粒子
  const particles = Array.from({ length: 50 }, () => new Particle(x, y, color))
  fireworks.push(particles)
}

// 随机生成烟花
const randomFirework = () => {
  if (Math.random() < 0.02) { // 2%的概率生成烟花
    createFirework()
  }
}

const animate = () => {
  if (!ctx) return

  const width = window.innerWidth
  const height = window.innerHeight

  // 不完全清除画布，而是创建一个渐变效果
  ctx.fillStyle = 'rgba(15, 23, 42, 0.1)' // 使用带透明度的深色来实现轨迹效果
  ctx.fillRect(0, 0, width, height)

  // 更新和绘制星星
  stars.forEach(star => {
    // 存储当前位置用于轨迹效果
    star.trail.push({ x: star.x, y: star.y })

    // 如果轨迹太长，移除最老的位置
    if (star.trail.length > star.trailLength) {
      star.trail.shift()
    }

    // 绘制轨迹
    ctx.beginPath()
    ctx.moveTo(star.trail[0].x, star.trail[0].y)
    star.trail.forEach((pos, index) => {
      const alpha = index / star.trail.length
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, star.size * alpha, 0, Math.PI * 2)
      ctx.fill()
    })

    // 绘制当前星星位置
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fill()

    // 向上移动星星
    star.y -= star.speed

    // 当星星到达顶部时重置位置
    if (star.y < 0) {
      star.y = height
      star.x = Math.random() * width
      star.trail = [] // 重置位置时清除轨迹
    }
  })

  // 更新和绘制烟花
  fireworks = fireworks.filter(particles => {
    particles = particles.filter(particle => particle.update())
    particles.forEach(particle => particle.draw(ctx))
    return particles.length > 0
  })

  // 随机生成新烟花
  // randomFirework()

  animationFrameId = requestAnimationFrame(animate)
}

const handleResize = () => {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initStars()
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  handleResize()
  animate()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <canvas
      ref="canvas"
      class="absolute top-0 left-0 w-full h-full"
  ></canvas>
</template>