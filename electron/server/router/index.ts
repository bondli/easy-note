import express from 'express';
import { createTopic, getTopicInfo, getTopics, getTopicsByTagId, updateTopic, moveTopic, getTopicCounts } from './topic-controller';
import { createNote, getNoteInfo, getNotes, updateNote, deleteNote } from './note-controller';
import { createUser, updateUser } from './user-controller';
import { createTags } from './tag-controller';

const router = express.Router();

router.post('/topic/add', createTopic);
router.get('/topic/detail', getTopicInfo);
router.get('/topic/getList', getTopics);
router.get('/topic/getListByTagId', getTopicsByTagId);
router.post('/topic/update', updateTopic);
router.post('/topic/move', moveTopic);
router.get('/topic/counts', getTopicCounts);

router.post('/note/create', createNote);
router.get('/note/detail', getNoteInfo);
router.get('/note/list', getNotes);
router.post('/note/update', updateNote);
router.get('/note/delete', deleteNote);

router.post('/user/init', createUser);
router.post('/user/update', updateUser);

router.post('tags/add', createTags);

export default router;
