import { Box, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import Card from '@mui/material/Card';
import React from "react";


interface ICard{
  title: string, 
  subtitle: string,
  image?: string
}


export const CardT = (props: ICard) =>{

    return(
        <Card sx={{ display: 'flex', height: '150px'}}>
          <CardMedia
              component="img"
              sx={{ width: 251 }}
              image={props.image}
              alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography className='title' component="div" variant="h5">
                  {props.title}
                </Typography>
                <Typography className='subtitle'>
                  {props.subtitle}
                </Typography>
              </CardContent>
            </Box>
            
        </Card>
    );
}