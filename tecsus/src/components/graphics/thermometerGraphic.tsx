import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

interface ThermometerGraphicProps {
    min: number;
    max: number;
    value: number;
    title: string;
    unit: string;
}

const getGradientColor = (value: number, min: number, max: number): string => {
  const ratio = (value - min) / (max - min);
  if (ratio < 0.25) return '#40a9ff';   
  if (ratio < 0.5) return '#73d13d';    
  if (ratio < 0.75) return '#ffa940';   
  return '#ff4d4f';                     
};

export default function ThermometerGraphic (props: ThermometerGraphicProps) {
  const percent = Math.min(Math.max((props.value - props.min) / (props.max - props.min), 0), 1);
  const fillColor = useMemo(() => getGradientColor(props.value, props.min, props.max), [props.value, props.min, props.max]);

  const numTicks = 7;
  const tickStep = (props.max - props.min) / (numTicks - 1);
  const ticks = Array.from({ length: numTicks }, (_, i) => Math.round(props.min + i * tickStep));

  return (
    <Box display="flex" flexDirection="column" alignItems="center" height={{ xs: 260, md: 300 }}>
      <Typography 
        fontSize={'18px'} 
        fontWeight={600} 
        color="#2c3e50" 
        textAlign="center" 
        mb={2}
        sx={{ fontFamily: 'Segoe UI, sans-serif' }}
    >
        {props.title}
      </Typography>

      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" height="100%">
        <Box mr={1} display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-end" height="100%">
          {ticks.slice().reverse().map((tick) => (
            <Typography key={tick} fontSize={12} color="#666">{tick}</Typography>
          ))}
        </Box>

        <Box
          position="relative"
          width={36}
          height="100%"
          borderRadius={20}
          bgcolor="linear-gradient(to bottom, #eee, #ddd)"
          sx={{
            background: 'linear-gradient(to bottom, #eee, #ddd)',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              background: `linear-gradient(to top, ${fillColor}, ${fillColor}99)`,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              boxShadow: `0 0 10px ${fillColor}88`,
            }}
            animate={{ height: `${percent * 100}%` }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />

          <Box
            sx={{
              position: 'absolute',
              bottom: -18,
              width: 42,
              height: 42,
              backgroundColor: fillColor,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${fillColor}55`,
              zIndex: 1,
              marginTop: 10,
            }}
          />

          <motion.div
            initial={false}
            animate={{ bottom: `${percent * 100}%` }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              transform: 'translateY(70%) translateX(90%)',
              backgroundColor: 'white',
              padding: '2px 6px',
              fontSize: 12,
              borderRadius: 8,
              boxShadow: '0 0 4px rgba(0,0,0,0.15)',
              color: fillColor,
              fontWeight: 600,
              zIndex: 4,
            }}
          >
            {props.value} {props.unit}
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}