import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface BucketGraphicProps {
    value: number;
    title?: string;
    min: number;
    max: number;
    unit?: string;
    measureDate: string;
}

export default function BucketGraphic(props: BucketGraphicProps) {

    const percent = Math.min(Math.max((props.value - props.min) / (props.max - props.min), 0), 1);
    
    const numTicks = 5;
    const tickStep = (props.max - props.min) / (numTicks - 1);
    const ticks = Array.from({ length: numTicks }, (_, i) => Math.round(props.min + i * tickStep));
    
    return (
        <Box display="flex" flexDirection="column" alignItems="center" height={{ xs: 260, md: 300 }}>
            <Typography 
                fontSize={'18px'} 
                fontWeight={600} 
                color="#2c3e50" 
                textAlign="center" 
                sx={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
                {props.title}
            </Typography>
            <Typography 
                fontSize={14} 
                color="#666" 
                textAlign="center" 
                mb={2}
                sx={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
                {new Date(Number(props.measureDate) * 1000).toLocaleString()}
            </Typography>
            
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" height="100%">
                <Box mr={1} display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-end" height="100%">
                    {ticks.slice().reverse().map((tick) => (
                        <Typography key={tick} fontSize={12} color="#666">{tick}</Typography>
                    ))}
                </Box>
                <Box
                    position="relative"
                    width={200}
                    height="100%"
                    mr={3}
                    bgcolor="linear-gradient(to bottom, #eee, #ddd)"
                    sx={{
                        background: 'linear-gradient(to bottom, #eee, #ddd)',
                        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                        borderBottomRightRadius: 4,
                        borderBottomLeftRadius: 4,
                    }}
                >
                    <motion.div
                        style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        background: `linear-gradient(to top, #4aa3df, #4aa3df99)`,
                        // borderTopLeftRadius: 20,
                        // borderTopRightRadius: 20,
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5, 
                        borderBottomRightRadius: 4,
                        borderBottomLeftRadius: 4,
                        boxShadow: `0 0 10px #4aa3df88`,
                        }}
                        animate={{ height: `${percent * 100}%` }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                    />

                    <motion.div
                        initial={false}
                        animate={{ bottom: `${percent * 100}%` }}
                        transition={{ duration: 0.8 }}
                        style={{
                        position: 'absolute',
                        transform: 'translateY(70%) translateX(200%)',
                        backgroundColor: 'white',
                        padding: '2px 6px',
                        fontSize: 12,
                        borderRadius: 8,
                        boxShadow: '0 0 4px rgba(0,0,0,0.15)',
                        color: '#4aa3df',
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