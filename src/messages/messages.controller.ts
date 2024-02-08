import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard.guard';
import { Request } from 'express';
import { CreateMessageDTO } from './dto/create.message.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('messages')
@ApiTags('Messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  //--------------------- Receive all messages --------------------

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'All messages',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: {
            type: 'number',
            description: 'userid',
          },
          text: {
            type: 'string',
          },
          postage_date: {
            type: 'Date',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: '404',
        },
        message: {
          type: 'string',
          example: 'Message not found',
        },
      },
    },
  })
  async getAllMessage(@Req() request: Request) {
    return await this.messagesService.findAllMessage(request.user['email']);
  }

  //----------------------- Check User To Send Message ------------

  @Get('/send-message/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'slug',
    required: true,
    description: 'slug of the user to whom the message is to be sent',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: '404',
        },
        message: {
          type: 'string',
          example: 'user not found',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        displayName: {
          type: 'string',
          description: 'User display name',
          example: 'ali',
        },
      },
    },
  })
  async checkUserToSendM(@Param('slug') userSlug: string) {
    return await this.messagesService.checkUser(userSlug);
  }

  //---------------------- Delete a message ----------------------

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'message id',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'ok' })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: '404',
        },
        message: {
          type: 'string',
          example: 'Message not found',
        },
      },
    },
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.deleteOne(id);
  }

  //---------------------- Delete messages ------------------------

  @Delete('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'ok' })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: '404',
        },
        message: {
          type: 'string',
          example: 'Message not found',
        },
      },
    },
  })
  async deleteAll(@Req() request: Request) {
    return await this.messagesService.deleteAll(request.user['email']);
  }

  //---------------------- Create a message ----------------------

  @Post('/send-message')
  @ApiBody({ type: CreateMessageDTO })
  @ApiResponse({ status: 201, description: 'Message saved successfully' })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: '404',
        },
        message: {
          type: 'string',
          example: 'user not found',
        },
      },
    },
  })
  async createMessage(@Body() messageData: CreateMessageDTO) {
    return await this.messagesService.createMessage(messageData);
  }
}
