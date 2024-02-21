import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Link from 'next/link';

export default function DetectorCard(props: {}) {
  return (
    <Link href="/detector">
        <Card variant="outlined" className="bg-gray-800 border-gray-700 hover:brightness-125" sx={{ width: 300 }}>
        <CardOverflow>
          <AspectRatio ratio="2">
            <img
              src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318"
              srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318&dpr=2 2x"
              loading="lazy"
              alt=""
            />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Typography className="text-white" level="title-md">Yosemite National Park</Typography>
          <Typography className="text-gray-400" level="body-sm">California</Typography>
        </CardContent>
        <CardOverflow variant="soft" className="bg-gray-800">
          <Divider inset="context" />
          <CardContent orientation="horizontal">
            <Typography className="text-gray-400" level="body-xs" fontWeight="md">
              2/5 Rating
            </Typography>
            <Divider orientation="vertical" />
            <Typography className="text-gray-400" level="body-xs" fontWeight="md">
              6.3k Uses
            </Typography>
          </CardContent>
        </CardOverflow>
      </Card>
    </Link>
  );
}