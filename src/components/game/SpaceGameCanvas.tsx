'use client'

import React, { useRef, useEffect, useCallback } from 'react'

interface GameObject {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  active: boolean
}

interface Ship extends GameObject {
  angle: number
  thrust: number
  drag: number
}

interface Meteor extends GameObject {
  rotationSpeed: number
  rotation: number
}

interface Bullet extends GameObject {
  damage: number
  life: number
}

interface Explosion {
  x: number
  y: number
  particles: Array<{
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
  }>
}

export default function SpaceGameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const gameStateRef = useRef({
    ship: {
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0,
      thrust: 0.23,      // +50% скорости (0.15 * 1.5)
      drag: 0.88,        // меньше торможения для более отзывчивого управления
      size: 15,          // немного крупнее для четкости
      active: true
    } as Ship,
    meteors: [] as Meteor[],
    bullets: [] as Bullet[],
    explosions: [] as Explosion[],
    mouse: { x: 100, y: 100 },
    lastMeteorSpawn: 0,
    lastBulletFired: 0,
    score: 0,
    asteroidsDestroyed: 0,
    lastScoreAnimation: 0,
    scoreAnimationScale: 1
  })

  // 🕹️ Ретро монохромная палитра (векторная графика 80-х)
  const colors = {
    primary: '#00ccff',     // neon-blue - основной цвет как в старых аркадах
    dim: '#0066aa',         // приглушенный синий для эффектов
    bright: '#66ddff'       // яркий для подсветки
  }

  // 🚀 Обновление корабля с адаптивной скоростью
  const updateShip = useCallback((ship: Ship, mouseX: number, mouseY: number, canvas: HTMLCanvasElement) => {
    const dx = mouseX - ship.x
    const dy = mouseY - ship.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 5) {
      // 🎯 АДАПТИВНАЯ СКОРОСТЬ: чем дальше курсор, тем быстрее летим!
      const minThrust = 0.15   // минимальная скорость
      const maxThrust = 0.45   // максимальная скорость  
      const maxDistance = 300  // расстояние для максимальной скорости
      
      // Вычисляем адаптивный thrust на основе расстояния
      const thrustMultiplier = Math.min(distance / maxDistance, 1)
      const adaptiveThrust = minThrust + (maxThrust - minThrust) * thrustMultiplier
      
      // Плавное движение к курсору с адаптивной скоростью
      ship.vx += (dx / distance) * adaptiveThrust
      ship.vy += (dy / distance) * adaptiveThrust
      
      // Поворот корабля
      ship.angle = Math.atan2(dy, dx)
    }
    
    // Применяем трение (чуть меньше для быстрого реагирования)
    ship.vx *= 0.9
    ship.vy *= 0.9
    
    // Обновляем позицию
    ship.x += ship.vx
    ship.y += ship.vy
    
    // Границы экрана с "отскоком"
    if (ship.x < 0) { ship.x = 0; ship.vx *= -0.5 }
    if (ship.x > canvas.width) { ship.x = canvas.width; ship.vx *= -0.5 }
    if (ship.y < 0) { ship.y = 0; ship.vy *= -0.5 }
    if (ship.y > canvas.height) { ship.y = canvas.height; ship.vy *= -0.5 }
  }, [])

  // ☄️ Создание полигонального метеорита (как в Asteroids)
  const createMeteor = useCallback((canvas: HTMLCanvasElement): Meteor => {
    return {
      x: Math.random() * canvas.width,
      y: -30,
      vx: (Math.random() - 0.5) * 0.5,  // почти строго вниз, минимальное отклонение
      vy: 2 + Math.random() * 2,        // быстрее и постоянная скорость
      size: 12 + Math.random() * 16,    // разные размеры
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
      active: true
    }
  }, [])

  // ⚡ Создание пули-линии (как в векторных играх)
  const createBullet = useCallback((ship: Ship): Bullet => {
    return {
      x: ship.x,
      y: ship.y,
      vx: Math.cos(ship.angle) * 12,  // быстрее
      vy: Math.sin(ship.angle) * 12,
      size: 2,
      damage: 1,
      life: 120,  // дольше живет, летит до края экрана
      active: true
    }
  }, [])

  // 💥 Создание взрыва
  const createExplosion = useCallback((x: number, y: number): Explosion => {
    const particles = []
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8
      const speed = 2 + Math.random() * 4
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20 + Math.random() * 20,
        maxLife: 40,
        size: 2 + Math.random() * 3
      })
    }
    return { x, y, particles }
  }, [])

  // 🎯 Автоматическая стрельба
  const autoShoot = useCallback((gameState: typeof gameStateRef.current, now: number) => {
    const { ship, meteors, bullets } = gameState
    
    // Находим ближайший метеорит
    let nearestMeteor: Meteor | null = null
    let nearestDistance = 120 // радиус автострельбы
    
    meteors.forEach(meteor => {
      if (!meteor.active) return
      const dx = meteor.x - ship.x
      const dy = meteor.y - ship.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestMeteor = meteor
      }
    })
    
    // Стреляем с задержкой 200мс
    if (nearestMeteor && now - gameState.lastBulletFired > 200) {
      // Поворачиваем корабль к цели  
      const target = nearestMeteor as Meteor // явное приведение типа
      const dx = target.x - ship.x
      const dy = target.y - ship.y
      ship.angle = Math.atan2(dy, dx)
      
      bullets.push(createBullet(ship))
      gameState.lastBulletFired = now
    }
  }, [createBullet])

  // 🚀 Отрисовка корабля в стиле векторной графики (Asteroids)
  const drawShip = useCallback((ctx: CanvasRenderingContext2D, ship: Ship) => {
    ctx.save()
    ctx.translate(ship.x, ship.y)
    ctx.rotate(ship.angle)
    
    // Векторные линии без заливки
    ctx.shadowColor = colors.primary
    ctx.shadowBlur = 3
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 2
    ctx.fillStyle = 'transparent'
    
    // Простой треугольник (как в оригинальных Asteroids)
    ctx.beginPath()
    ctx.moveTo(12, 0)      // нос корабля
    ctx.lineTo(-8, -6)     // левое крыло
    ctx.lineTo(-8, 6)      // правое крыло
    ctx.closePath()
    ctx.stroke()           // только контур, без заливки
    
    ctx.restore()
  }, [colors])

  // ☄️ Отрисовка полигонального астероида (векторная графика)
  const drawMeteor = useCallback((ctx: CanvasRenderingContext2D, meteor: Meteor) => {
    ctx.save()
    ctx.translate(meteor.x, meteor.y)
    ctx.rotate(meteor.rotation)
    
    // Векторные линии, как в оригинальных Asteroids
    ctx.shadowColor = colors.primary
    ctx.shadowBlur = 2
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 1.5
    ctx.fillStyle = 'transparent'
    
    // Неровный полигон (разные размеры углов)
    ctx.beginPath()
    const sides = 8
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides
      // Случайные вариации радиуса для каждого астероида
      const radiusVariation = 0.7 + Math.sin(meteor.rotation * 2 + i * 1.3) * 0.4
      const radius = meteor.size * radiusVariation
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()  // только контур
    
    ctx.restore()
  }, [colors])

  // ⚡ Отрисовка пули-линии (векторная графика)
  const drawBullet = useCallback((ctx: CanvasRenderingContext2D, bullet: Bullet) => {
    ctx.save()
    
    // Линия с направлением движения
    ctx.shadowColor = colors.bright
    ctx.shadowBlur = 3
    ctx.strokeStyle = colors.bright
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    // Линия от предыдущей позиции до текущей
    const prevX = bullet.x - bullet.vx * 0.5
    const prevY = bullet.y - bullet.vy * 0.5
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(bullet.x, bullet.y)
    ctx.stroke()
    
    ctx.restore()
  }, [colors])

  // 💥 Отрисовка взрыва (векторные частицы)
  const drawExplosion = useCallback((ctx: CanvasRenderingContext2D, explosion: Explosion) => {
    explosion.particles.forEach(particle => {
      if (particle.life <= 0) return
      
      const alpha = particle.life / particle.maxLife
      ctx.save()
      ctx.shadowColor = colors.bright
      ctx.shadowBlur = 4
      ctx.strokeStyle = colors.bright + Math.floor(alpha * 255).toString(16).padStart(2, '0')
      ctx.lineWidth = alpha * 2
      ctx.lineCap = 'round'
      
      // Маленькие векторные линии вместо кругов
      ctx.beginPath()
      ctx.moveTo(particle.x - particle.size/2, particle.y)
      ctx.lineTo(particle.x + particle.size/2, particle.y)
      ctx.moveTo(particle.x, particle.y - particle.size/2)
      ctx.lineTo(particle.x, particle.y + particle.size/2)
      ctx.stroke()
      ctx.restore()
    })
  }, [colors])

  // 🎮 Основной игровой цикл
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const gameState = gameStateRef.current
    const now = Date.now()

    // Очистка с эффектом "выгорания" экрана (меньше alpha = дольше следы)
    ctx.fillStyle = 'rgba(0, 8, 16, 0.05)'  // слабая очистка для persistence эффекта
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 📺 Рисуем пиксельную CRT сетку прямо на canvas
    ctx.save()
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.05)'
    ctx.lineWidth = 0.5
    ctx.globalCompositeOperation = 'screen'
    
    // Горизонтальные линии развертки
    for (let y = 0; y < canvas.height; y += 3) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    
    // Вертикальные пиксельные полосы (реже)
    ctx.strokeStyle = 'rgba(0, 180, 255, 0.04)'
    for (let x = 0; x < canvas.width; x += 4) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    
    ctx.restore()

    // 📺 CRT ПОМЕХИ И ИНТЕРФЕРЕНЦИЯ (как на старых мониторах)
    ctx.save()
    
    // 1. Случайный пиксельный шум (каждые 3-4 кадра)
    if (Math.random() < 0.3) {
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = 1 + Math.random() * 2
        
        ctx.fillStyle = Math.random() > 0.7 ? 
          'rgba(255, 255, 255, 0.6)' : 'rgba(0, 200, 255, 0.4)'
        ctx.fillRect(x, y, size, size)
      }
    }
    
    // 2. Горизонтальные полосы помех (редко, но эффектно)
    if (Math.random() < 0.02) {
      const stripY = Math.random() * canvas.height
      const stripHeight = 2 + Math.random() * 4
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.fillRect(0, stripY, canvas.width, stripHeight)
      
      // Дополнительный цветной сбой
      ctx.fillStyle = 'rgba(0, 255, 100, 0.1)'
      ctx.fillRect(0, stripY + stripHeight, canvas.width, 1)
    }
    
    // 3. "Сбой синхронизации" - сдвиг части экрана (очень редко)
    if (Math.random() < 0.005) {
      const glitchY = Math.random() * canvas.height * 0.8
      const glitchHeight = 20 + Math.random() * 40
      const shift = (Math.random() - 0.5) * 10
      
      // Копируем часть экрана и сдвигаем
      const imageData = ctx.getImageData(0, glitchY, canvas.width, glitchHeight)
      ctx.putImageData(imageData, shift, glitchY)
      
      // Добавляем цветную полосу на месте сбоя
      ctx.fillStyle = 'rgba(255, 0, 100, 0.1)'
      ctx.fillRect(0, glitchY, canvas.width, 2)
    }
    
    // 4. Мерцание экрана (вариация яркости)
    if (Math.random() < 0.1) {
      const flicker = 0.02 + Math.random() * 0.03
      ctx.fillStyle = `rgba(0, 150, 255, ${flicker})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    ctx.restore()

    // Обновляем корабль
    updateShip(gameState.ship, gameState.mouse.x, gameState.mouse.y, canvas)

    // Спавн метеоритов каждые 0.8 секунды (больше астероидов!)
    if (now - gameState.lastMeteorSpawn > 800) {
      gameState.meteors.push(createMeteor(canvas))
      gameState.lastMeteorSpawn = now
    }

    // Автострельба
    autoShoot(gameState, now)

    // Обновляем метеориты
    gameState.meteors.forEach(meteor => {
      if (!meteor.active) return
      meteor.y += meteor.vy
      meteor.x += meteor.vx
      meteor.rotation += meteor.rotationSpeed
      
      // Удаляем метеориты за экраном
      if (meteor.y > canvas.height + 50) {
        meteor.active = false
      }
    })

    // Обновляем пули
    gameState.bullets.forEach(bullet => {
      if (!bullet.active) return
      bullet.x += bullet.vx
      bullet.y += bullet.vy
      bullet.life--
      
      if (bullet.life <= 0 || 
          bullet.x < 0 || bullet.x > canvas.width ||
          bullet.y < 0 || bullet.y > canvas.height) {
        bullet.active = false
      }
    })

    // Проверяем коллизии пуля-метеорит
    gameState.bullets.forEach(bullet => {
      if (!bullet.active) return
      gameState.meteors.forEach(meteor => {
        if (!meteor.active) return
        
        const dx = bullet.x - meteor.x
        const dy = bullet.y - meteor.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < meteor.size + bullet.size) {
          // Попадание! 🎯
          bullet.active = false
          meteor.active = false
          gameState.explosions.push(createExplosion(meteor.x, meteor.y))
          gameState.asteroidsDestroyed++
          gameState.score += 10
          
          // Запуск анимации счетчика
          gameState.lastScoreAnimation = now
          gameState.scoreAnimationScale = 1.5
        }
      })
    })

    // Обновляем взрывы
    gameState.explosions.forEach(explosion => {
      explosion.particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life--
        particle.vy += 0.1 // гравитация
      })
    })

    // Отрисовка всех объектов
    drawShip(ctx, gameState.ship)
    
    gameState.meteors.forEach(meteor => {
      if (meteor.active) drawMeteor(ctx, meteor)
    })
    
    gameState.bullets.forEach(bullet => {
      if (bullet.active) drawBullet(ctx, bullet)
    })
    
    gameState.explosions.forEach(explosion => {
      drawExplosion(ctx, explosion)
    })

    // Очистка неактивных объектов
    gameState.meteors = gameState.meteors.filter(m => m.active)
    gameState.bullets = gameState.bullets.filter(b => b.active)
    gameState.explosions = gameState.explosions.filter(e => 
      e.particles.some(p => p.life > 0)
    )

    // 🎯 UI в стиле ретро аркады
    ctx.save()
    
    // Обновляем анимацию счетчика
    if (now - gameState.lastScoreAnimation < 300) {
      const animProgress = (now - gameState.lastScoreAnimation) / 300
      gameState.scoreAnimationScale = 1.5 - (animProgress * 0.5)
    } else {
      gameState.scoreAnimationScale = 1
    }
    
    // Счетчик астероидов в правом нижнем углу
    ctx.shadowColor = colors.primary
    ctx.shadowBlur = 4
    ctx.fillStyle = colors.primary
    ctx.font = `bold ${Math.floor(18 * gameState.scoreAnimationScale)}px monospace`
    ctx.textAlign = 'right'
    
    const counterText = `ASTEROIDS: ${gameState.asteroidsDestroyed}`
    ctx.fillText(counterText, canvas.width - 20, canvas.height - 20)
    
    // Дополнительный счет очков сверху слева (как в оригинале)
    ctx.textAlign = 'left'
    ctx.font = 'bold 14px monospace'
    ctx.fillText(`SCORE: ${gameState.score}`, 20, 25)
    
    ctx.restore()

    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [updateShip, createMeteor, createBullet, createExplosion, autoShoot, drawShip, drawMeteor, drawBullet, drawExplosion, colors])

  // Mouse tracking
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    gameStateRef.current.mouse.x = event.clientX - rect.left
    gameStateRef.current.mouse.y = event.clientY - rect.top
  }, [])

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  // Setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initial setup
    handleResize()
    
    // Event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    
    // Start game loop
    gameLoop()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [handleResize, handleMouseMove, gameLoop])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-8 pointer-events-none z-5"
      style={{ 
        mixBlendMode: 'screen',
        opacity: 0.95,
        filter: 'contrast(1.3) brightness(1.2) saturate(1.1)',
        
        // 📺 CRT МОНИТОР С ВИДИМОЙ ПИКСЕЛЬНОЙ СЕТКОЙ
        background: `
          radial-gradient(ellipse 110% 100% at 50% 50%, 
            rgba(0, 150, 255, 0.08) 0%, 
            rgba(0, 100, 200, 0.06) 40%,
            rgba(0, 80, 160, 0.04) 70%,
            rgba(0, 50, 120, 0.06) 85%,
            rgba(0, 30, 80, 0.1) 100%
          )
        `,
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(0, 220, 255, 0.15) 1px,
            transparent 2px,
            transparent 3px
          ),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(0, 180, 255, 0.1) 1px,
            transparent 2px,
            transparent 4px
          )
        `,
        backgroundSize: '100% 100%, 4px 4px, 6px 6px',
        
        // Эффект выпуклого экрана электронно-лучевой трубки
        boxShadow: `
          inset 0 0 150px rgba(0, 200, 255, 0.08),
          inset 0 0 80px rgba(0, 150, 255, 0.1),
          inset 0 0 40px rgba(0, 100, 200, 0.12),
          0 0 25px rgba(0, 200, 255, 0.1),
          0 0 50px rgba(0, 150, 255, 0.06)
        `,
        
        // 🔥 ОВАЛЬНЫЙ CRT МОНИТОР 96% размера
        width: '96%',
        height: '93%',
        borderRadius: '6%',
        
        // Дополнительные эффекты старого монитора
        backgroundBlendMode: 'screen, overlay, normal',
        imageRendering: 'pixelated'  // пиксельная четкость
      }}
    />
  )
}
