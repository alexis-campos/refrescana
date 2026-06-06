'use client'

import Image from '@/components/ui/Img'
import { motion } from 'framer-motion'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations'
import { Heading, SubHeading, Text } from '@/components/ui'

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image: string
}

const TEAM: TeamMember[] = [
  {
    id: 1,
    name: 'Rolin Aquino',
    role: 'Fundador & Director General',
    bio: 'Líder visionario de Princesa Inka Nature SAC. Apasionado por la riqueza natural del Perú y comprometido con llevar productos de la selva peruana a cada hogar.',
    image: '/team/team-1.webp',
  },
  {
    id: 2,
    name: 'Equipo de Producción',
    role: 'Producción & Calidad',
    bio: 'Nuestro equipo asegura que cada lote cumpla con los más altos estándares de pureza. Procesos artesanales con control de calidad riguroso.',
    image: '/team/team-2.webp',
  },
  {
    id: 3,
    name: 'Equipo Comercial',
    role: 'Ventas & Distribución',
    bio: 'Encargados de conectar nuestros productos naturales con minimarkets, ferias y emprendedores en todo el territorio nacional.',
    image: '/team/team-3.webp',
  },
]

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="cursor-default">
      {/* Photo */}
      <div className="relative aspect-square rounded-[var(--radius-xl)] overflow-hidden mb-4 bg-surface group">
        <motion.div className="w-full h-full">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ filter: 'saturate(0.95) brightness(1.02) contrast(1.01)' }}
          />
        </motion.div>
      </div>

      {/* Name & role */}
      <SubHeading as="h3" className="text-[length:var(--text-h3)] mb-1">
        {member.name}
      </SubHeading>
      <Text size="small" className="text-accent mb-2">
        {member.role}
      </Text>

      {/* Bio — always visible */}
      <Text size="small" className="text-text/65 leading-relaxed">
        {member.bio}
      </Text>
    </div>
  )
}

export function NuestroEquipo() {
  return (
    <section className="py-[var(--section)] px-[var(--container-px)] bg-bg">
      <div className="max-w-[1280px] mx-auto">
        <ScrollReveal className="mb-[var(--section-sm)]">
          <Heading level={2} className="mb-4">
            Nuestro Equipo
          </Heading>
          <Text className="text-text/70 max-w-lg">
            Personas apasionadas por la naturaleza y comprometidas con llevar lo mejor de la selva peruana a tu vida.
          </Text>
        </ScrollReveal>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6"
          staggerDelay={0.1}
          delayStart={0.1}
        >
          {TEAM.map((member) => (
            <StaggerItem key={member.id}>
              <TeamCard member={member} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
