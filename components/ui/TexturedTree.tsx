"use client";
import React from 'react';
import { motion } from "framer-motion";
const RANDOMS = [0.12, 0.85, 0.43, 0.91, 0.23, 0.54, 0.76, 0.31, 0.88, 0.67, 0.19, 0.58, 0.94, 0.35, 0.71, 0.05, 0.49, 0.82, 0.27, 0.63, 0.08, 0.52, 0.96, 0.39, 0.74, 0.15, 0.60, 0.98, 0.41, 0.78, 0.21, 0.65, 0.02, 0.46, 0.80, 0.25, 0.69, 0.11, 0.56, 0.90, 0.33, 0.77, 0.17, 0.61, 0.04, 0.48, 0.84, 0.29, 0.73, 0.14];
const seedRandom = (seed: number) => {
  return RANDOMS[Math.abs(seed) % RANDOMS.length];
};

export const TexturedTree = ({ inkColor, shadowColor }: { inkColor: string, shadowColor: string }) => {
  return (
    <>
      <g filter="url(#soft-shadow)">
        {/* Main Trunk */}
        <path d="M150 550 C 150 400, 180 200, 200 150 C 250 200, 230 400, 250 550" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />

        {/* Realistic Bark Lines (Carefully crafted paths following the trunk) */}
        <g stroke={inkColor} strokeWidth="0.5" fill="none" opacity="0.6">
          <path d="M165 550 C 160 400, 185 200, 210 150" />
          <path d="M180 550 C 175 420, 190 280, 220 150" />
          <path d="M195 550 C 185 450, 205 350, 228 150" />
          <path d="M210 550 C 200 450, 215 350, 235 150" />
          <path d="M225 550 C 215 450, 225 350, 240 180" />
          <path d="M240 550 C 230 450, 235 350, 246 220" />

          {/* Wood Knot 1 */}
          <path d="M185 350 C 185 340, 195 340, 195 350 C 195 360, 185 360, 185 350 Z" />
          <path d="M180 345 C 170 330, 205 330, 200 355 C 195 380, 175 360, 180 345" />

          {/* Wood Knot 2 */}
          <path d="M215 250 C 212 245, 218 245, 218 250 C 218 255, 212 255, 215 250 Z" />
          <path d="M210 245 C 205 235, 225 235, 225 255 C 220 270, 205 260, 210 245" />
        </g>

        {/* Trunk Shadow Hatching (Left side shading) */}
        <g stroke={inkColor} strokeWidth="0.4" fill="none" opacity="0.5">
          <path d="M 155 520 L 165 510 M 153 500 L 163 490 M 152 480 L 162 470" />
          <path d="M 151 460 L 161 450 M 150 440 L 160 430 M 152 420 L 162 410" />
          <path d="M 154 400 L 164 390 M 157 380 L 167 370 M 160 360 L 170 350" />
          <path d="M 163 340 L 173 330 M 167 320 L 177 310 M 172 300 L 182 290" />
          <path d="M 175 280 L 185 270 M 180 260 L 190 250 M 185 240 L 195 230" />
          <path d="M 190 220 L 200 210 M 195 200 L 205 190 M 198 180 L 208 170" />
          <path d="M 200 160 L 210 150 M 202 140 L 212 130 M 205 120 L 215 110" />
        </g>

        {/* Detailed Sprawling Roots */}
        <path d="M150 550 Q 120 560 80 580" fill="none" stroke={inkColor} strokeWidth="1" />
        <path d="M150 550 Q 140 570 120 590" fill="none" stroke={inkColor} strokeWidth="0.8" />
        <path d="M250 550 Q 280 560 320 580" fill="none" stroke={inkColor} strokeWidth="1" />
        <path d="M250 550 Q 260 570 280 590" fill="none" stroke={inkColor} strokeWidth="0.8" />
        <path d="M200 545 Q 210 565 220 580" fill="none" stroke={inkColor} strokeWidth="0.5" />

        {/* Main Branches */}
        <path d="M190 350 C 120 300, 80 250, 50 150" fill="none" stroke={inkColor} strokeWidth="1" />
        <path d="M210 320 C 280 250, 320 200, 350 150" fill="none" stroke={inkColor} strokeWidth="1" />
        <path d="M130 280 Q 90 230 40 200" fill="none" stroke={inkColor} strokeWidth="0.8" />
        <path d="M260 270 Q 300 230 350 200" fill="none" stroke={inkColor} strokeWidth="0.8" />
        <path d="M200 220 Q 220 150 200 50" fill="none" stroke={inkColor} strokeWidth="1" />

        {/* Hanging Mouse */}
        <motion.g whileHover={{ rotate: [0, 8, -6, 3, 0] }} transition={{ duration: 2, ease: "easeInOut" }} style={{ transformOrigin: "280px 250px", cursor: "pointer" }}>
          <path d="M280 250 C 290 320, 280 380, 290 450" fill="none" stroke={inkColor} strokeWidth="1" />
          <rect x="270" y="450" width="40" height="60" rx="20" fill="#ffffff" stroke={inkColor} strokeWidth="1" />
          <path d="M290 450 L290 475" stroke={inkColor} strokeWidth="1" />
        </motion.g>

        {/* --- Denser Canopy Layers --- */}
        {/* Back Layer */}
        <path d="M 10 150 C 10 50, 100 -20, 200 0 C 300 -20, 390 50, 390 150 C 450 200, 350 300, 250 250 C 200 300, 100 300, 50 250 C -50 250, -50 150, 10 150 Z" fill="#ffffff" stroke={inkColor} strokeWidth="1" />
        
        {/* Mid Layer */}
        <path d="M 30 140 C 40 70, 120 10, 200 20 C 280 10, 360 70, 360 140 C 400 180, 330 250, 250 210 C 210 250, 120 250, 70 210 C 0 220, 0 140, 30 140 Z" fill="#ffffff" stroke={inkColor} strokeWidth="1" />
        
        {/* Front Layer */}
        <path d="M 80 100 C 80 20, 150 -10, 200 10 C 250 -10, 320 20, 320 100 C 350 150, 250 200, 200 180 C 150 200, 50 150, 80 100 Z" fill="#fdfbf7" stroke={inkColor} strokeWidth="1" />
        
        {/* Subtle, Hand-drawn Hatching for Canopy Shadow (Instead of random noise) */}
        <g stroke={inkColor} strokeWidth="0.4" fill="none" opacity="0.6">
          {/* Bottom left shadow area */}
          <path d="M 40 220 L 60 200 M 50 230 L 70 210 M 60 240 L 80 220 M 70 245 L 90 225 M 80 250 L 100 230" />
          <path d="M 90 255 L 110 235 M 100 260 L 120 240 M 110 260 L 130 240" />
          
          {/* Bottom center shadow area */}
          <path d="M 210 255 L 230 235 M 220 260 L 240 240 M 230 260 L 250 240 M 240 255 L 260 235 M 250 250 L 270 230" />
          
          {/* Bottom right shadow area */}
          <path d="M 310 240 L 330 220 M 320 245 L 340 225 M 330 250 L 350 230 M 340 245 L 360 225" />
          <path d="M 360 230 L 380 210 M 370 230 L 390 210 M 380 220 L 400 200" />
          
          {/* Internal layer shadows */}
          <path d="M 100 180 L 120 160 M 110 185 L 130 165 M 120 190 L 140 170" />
          <path d="M 260 190 L 280 170 M 270 195 L 290 175 M 280 200 L 300 180" />
        </g>

        {/* Detailed Scalloped Leaf Clusters */}
        <g stroke={inkColor} strokeWidth="0.5" fill="none" opacity="0.7">
          {/* Top of canopy */}
          <path d="M 100 80 Q 110 70 120 80 Q 130 70 140 80 Q 150 70 160 80" />
          <path d="M 180 50 Q 190 40 200 50 Q 210 40 220 50 Q 230 40 240 50" />
          <path d="M 260 70 Q 270 60 280 70 Q 290 60 300 70" />
          
          {/* Mid canopy clusters */}
          <path d="M 150 120 Q 160 110 170 120 Q 180 110 190 120 Q 200 110 210 120" />
          <path d="M 230 130 Q 240 120 250 130 Q 260 120 270 130 Q 280 120 290 130" />
          <path d="M 80 150 Q 90 140 100 150 Q 110 140 120 150 Q 130 140 140 150" />
          <path d="M 300 140 Q 310 130 320 140 Q 330 130 340 140" />

          {/* Lower clusters */}
          <path d="M 120 180 Q 130 170 140 180 Q 150 170 160 180 Q 170 170 180 180" />
          <path d="M 200 190 Q 210 180 220 190 Q 230 180 240 190 Q 250 180 260 190" />
          <path d="M 280 180 Q 290 170 300 180 Q 310 170 320 180" />
          <path d="M 60 200 Q 70 190 80 200 Q 90 190 100 200" />
          <path d="M 320 200 Q 330 190 340 200 Q 350 190 360 200" />
        </g>
        
        {/* Hanging Vines */}
        <g stroke={inkColor} strokeWidth="0.5" fill="none" opacity="0.8">
           <path d="M 80 240 Q 85 300 80 350 Q 75 380 85 400" />
           <path d="M 90 245 Q 95 280 90 310" strokeWidth="0.3" />
           <path d="M 330 240 Q 325 320 335 380 Q 340 420 330 450" />
           <path d="M 320 245 Q 315 290 325 330" strokeWidth="0.3" />
        </g>
      </g>

      {/* Hand-drawn Falling Leaves (Simple leaf shapes, gently drifting) */}
      <g stroke={inkColor} strokeWidth="0.5" fill="#fdfbf7">
        <motion.path 
          d="M 100 250 Q 105 240 110 250 Q 105 260 100 250 Z" 
          initial={{ y: 0, x: 0 }} animate={{ y: 80, x: -10 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 250 280 Q 255 270 260 280 Q 255 290 250 280 Z" 
          initial={{ y: 0, x: 0 }} animate={{ y: 100, x: 20 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 380 220 Q 385 210 390 220 Q 385 230 380 220 Z" 
          initial={{ y: 0, x: 0 }} animate={{ y: 60, x: 15 }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M 180 300 Q 185 290 190 300 Q 185 310 180 300 Z" 
          initial={{ y: 0, x: 0 }} animate={{ y: 120, x: -20 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </g>

      {/* Wooden Tree Swing (Disney Storytelling Element) */}
      <g stroke={inkColor} strokeWidth="0.8" fill="none">
        {/* Ropes hanging from the left branch */}
        <path d="M 70 180 Q 75 300 70 480" />
        <path d="M 130 200 Q 125 300 130 480" />
        {/* Wooden Plank */}
        <rect x="50" y="480" width="100" height="12" rx="2" fill="#fdfbf7" strokeWidth="1" />
        {/* Wood grain and rope knots */}
        <path d="M 55 484 L 145 484 M 60 488 L 140 488" strokeWidth="0.4" />
        <path d="M 65 480 L 75 480 M 125 480 L 135 480" strokeWidth="1.5" />
      </g>

      {/* Pixie Dust (Magical Atmosphere) */}
      <g fill={inkColor} opacity="0.5">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.circle
            key={`dust-${i}`}
            r={1 + seedRandom(i)*1.5}
            initial={{ opacity: 0, y: 550 - seedRandom(i)*150, x: 20 + seedRandom(i+20)*380 }}
            animate={{ 
              opacity: [0, 0.8, 0], 
              y: 350 - seedRandom(i)*250, 
              x: 20 + seedRandom(i+20)*380 + (seedRandom(i+40)*60 - 30) 
            }}
            transition={{ 
              duration: 5 + seedRandom(i+10)*5, 
              repeat: Infinity, 
              ease: "easeInOut", 
              delay: seedRandom(i)*6 
            }}
          />
        ))}
      </g>



      {/* Cat */}
      <g transform="translate(350, 460)">
        <path d="M20 90 C 5 90, 0 60, 15 40 C 20 25, 10 15, 20 5 L 25 15 L 35 5 C 45 15, 35 25, 40 40 C 55 60, 50 90, 30 90 Z" fill="#ffffff" stroke={inkColor} strokeWidth="0.8" />
        <g stroke={inkColor} strokeWidth="0.5" fill="none" opacity="0.6">
          <path d="M25 85 L35 75 M20 80 L30 70 M22 70 L28 64" />
        </g>
      </g>
    </>
  );
};
