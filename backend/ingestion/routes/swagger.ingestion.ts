/**
 * @swagger
 * tags:
 *   name: Ingestions
 *   description: Ingestion management
 */

/**
 * @swagger
 * /api/api/ingestions:
 *   get:
 *     summary: Get all ingestion jobs
 *     tags: [Ingestions]
 *     security: [bearerAuth: []]
 *     responses:
 *       200:
 *         description: List of ingestion jobs
 */

/**
 * @swagger
 * /api/ingestions/{id}:
 *   get:
 *     summary: Get ingestion job by ID
 *     tags: [Ingestions]
 *     security: [bearerAuth: []]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Ingestion ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingestion job
 */

/**
 * @swagger
 * /api/ingestions:
 *   post:
 *     summary: Create an ingestion job
 *     tags: [Ingestions]
 *     security: [bearerAuth: []]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceType
 *             properties:
 *               sourceType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ingestion job created
 */

/**
 * @swagger
 * /api/ingestions/{id}:
 *   put:
 *     summary: Update ingestion job
 *     tags: [Ingestions]
 *     security: [bearerAuth: []]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Ingestion ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, running, completed, failed]
 *               logs:
 *                 type: array
 *                 items:
 *                   type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Ingestion updated
 */

/**
 * @swagger
 * /api/ingestions/{id}:
 *   delete:
 *     summary: Delete ingestion job
 *     tags: [Ingestions]
 *     security: [bearerAuth: []]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Ingestion ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingestion deleted
 */
