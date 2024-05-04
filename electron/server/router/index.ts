import express from 'express';
import { createTopic, getTopicInfo, getTopicsByNoteId, getTopicsByTagId, getTopicsByStatus, updateTopic, deleteTopic } from './topic-controller';
import { createNote, getNoteInfo, getNotes, updateNote, deleteNote } from './note-controller';
import { createUser, updateUser } from './user-controller';
import { createTags } from './tag-controller';

const router = express.Router();

router.post('/topic/add', createTopic);
router.get('/topic/detail', getTopicInfo);
router.get('/topic/getListByNoteId', getTopicsByNoteId);
router.get('/topic/getListByTagId', getTopicsByTagId);
router.get('/topic/getListByStatus', getTopicsByStatus);
router.post('/topic/update', updateTopic);
router.get('/topic/delete', deleteTopic);

router.post('/note/create', createNote);
router.get('/note/detail', getNoteInfo);
router.get('/note/list', getNotes);
router.post('/note/update', updateNote);
router.get('/note/delete', deleteNote);

router.post('/user/init', createUser);
router.post('/user/update', updateUser);

router.post('tags/add', createTags);

export default router;
