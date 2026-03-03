import {
	Alert,
	Button,
	Card,
	Col,
	InputNumber,
	List,
	Progress,
	Result,
	Row,
	Space,
	Statistic,
	Tag,
	Typography,
} from 'antd';
import { useMemo, useState } from 'react';

const { Text, Title } = Typography;

const MIN_NUMBER = 1;
const MAX_NUMBER = 100;
const MAX_ATTEMPTS = 10;

const MESSAGES = {
	intro: 'Nhập một số từ 1 đến 100 để bắt đầu.',
	low: 'Bạn đoán quá thấp!',
	high: 'Bạn đoán quá cao!',
	correct: 'Chúc mừng! Bạn đã đoán đúng!',
	outOfTurns: (answer: number) => `Bạn đã hết lượt! Số đúng là ${answer}.`,
	title: 'Bài 1: Trò chơi đoán số',
	description: 'Hệ thống sinh 1 số ngẫu nhiên trong khoảng 1 đến 100. Bạn có 10 lượt để đoán đúng.',
	attemptUsed: 'Lượt đã dùng',
	inputLabel: 'Nhập dự đoán',
	playAgain: 'Chơi lại',
	guessNow: 'Đoán ngay',
	winTitle: 'Bạn đã chiến thắng!',
	loseTitle: 'Bạn đã hết lượt!',
	winSubtitle: 'Nhấn Chơi lại để bắt đầu ván mới.',
	loseSubtitle: (answer: number) => `Số đúng là ${answer}. Nhấn Chơi lại để thử tiếp.`,
	historyTitle: 'Lịch sử đoán',
	emptyHistory: 'Chưa có lượt đoán nào.',
	lowTag: 'Bạn đoán quá thấp',
	highTag: 'Bạn đoán quá cao',
	correctTag: 'Chúc mừng! Bạn đã đoán đúng',
};

type GuessResult = 'low' | 'high' | 'correct';

type GuessHistoryItem = {
	value: number;
	result: GuessResult;
};

const createRandomNumber = () => Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
const clampGuess = (value: number) => Math.max(MIN_NUMBER, Math.min(MAX_NUMBER, value));

const getResultText = (result: GuessResult) => {
	if (result === 'low') return MESSAGES.lowTag;
	if (result === 'high') return MESSAGES.highTag;
	return MESSAGES.correctTag;
};

const DoanSo = () => {
	const [targetNumber, setTargetNumber] = useState<number>(createRandomNumber());
	const [guessInput, setGuessInput] = useState<number | string | null>(null);
	const [attempts, setAttempts] = useState<number>(0);
	const [message, setMessage] = useState<string>(MESSAGES.intro);
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [isWinner, setIsWinner] = useState<boolean>(false);
	const [history, setHistory] = useState<GuessHistoryItem[]>([]);

	const attemptPercent = useMemo(() => Math.round((attempts / MAX_ATTEMPTS) * 100), [attempts]);
	const guess =
		typeof guessInput === 'number'
			? clampGuess(guessInput)
			: typeof guessInput === 'string' && guessInput.trim() !== '' && !Number.isNaN(Number(guessInput))
				? clampGuess(Number(guessInput))
				: null;

	const normalizeGuessInput = () => {
		if (guessInput === null || guessInput === '') return;
		const parsed = Number(guessInput);
		if (Number.isNaN(parsed)) {
			setGuessInput(null);
			return;
		}
		setGuessInput(clampGuess(parsed));
	};

	const handleGuess = () => {
		if (guess === null || gameOver) return;

		const nextAttempts = attempts + 1;
		setAttempts(nextAttempts);

		if (guess === targetNumber) {
			setHistory((prev) => [...prev, { value: guess, result: 'correct' }]);
			setMessage(MESSAGES.correct);
			setIsWinner(true);
			setGameOver(true);
			return;
		}

		if (guess < targetNumber) {
			setHistory((prev) => [...prev, { value: guess, result: 'low' }]);
			setMessage(MESSAGES.low);
		} else {
			setHistory((prev) => [...prev, { value: guess, result: 'high' }]);
			setMessage(MESSAGES.high);
		}

		if (nextAttempts >= MAX_ATTEMPTS) {
			setMessage(MESSAGES.outOfTurns(targetNumber));
			setGameOver(true);
		}
	};

	const resetGame = () => {
		setTargetNumber(createRandomNumber());
		setGuessInput(null);
		setAttempts(0);
		setMessage(MESSAGES.intro);
		setGameOver(false);
		setIsWinner(false);
		setHistory([]);
	};

	const latestResult = history[history.length - 1]?.result;
	const alertType = latestResult === 'correct' ? 'success' : latestResult ? 'warning' : 'info';

	return (
		<Card bordered={false}>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<div>
					<Title level={3} style={{ marginBottom: 8 }}>
						{MESSAGES.title}
					</Title>
					<Text type='secondary'>{MESSAGES.description}</Text>
				</div>

				<Row gutter={[16, 16]}>
					<Col xs={24} md={12}>
						<Card size='small'>
							<Statistic title={MESSAGES.attemptUsed} value={`${attempts}/${MAX_ATTEMPTS}`} />
							<Progress
								percent={attemptPercent}
								status={gameOver && !isWinner ? 'exception' : 'active'}
								strokeColor={isWinner ? '#52c41a' : '#1677ff'}
							/>
						</Card>
					</Col>
					<Col xs={24} md={12}>
						<Card size='small'>
							<Space direction='vertical' size='small' style={{ width: '100%' }}>
								<Text strong>{MESSAGES.inputLabel}</Text>
								<Space wrap>
									<InputNumber
										min={MIN_NUMBER}
										max={MAX_NUMBER}
										placeholder='1 - 100'
										value={guessInput as number | string | null}
										onChange={(value) => {
											if (typeof value === 'number') {
												setGuessInput(clampGuess(value));
												return;
											}
											setGuessInput(value);
										}}
										onBlur={normalizeGuessInput}
										onPressEnter={() => {
											normalizeGuessInput();
											handleGuess();
										}}
										disabled={gameOver}
									/>
									<Button type='primary' onClick={handleGuess} disabled={guess === null || gameOver}>
										{MESSAGES.guessNow}
									</Button>
									<Button onClick={resetGame}>{MESSAGES.playAgain}</Button>
								</Space>
							</Space>
						</Card>
					</Col>
				</Row>

				<Alert message={message} type={alertType} showIcon />

				{gameOver ? (
					<Result
						status={isWinner ? 'success' : 'warning'}
						title={isWinner ? MESSAGES.winTitle : MESSAGES.loseTitle}
						subTitle={isWinner ? MESSAGES.winSubtitle : MESSAGES.loseSubtitle(targetNumber)}
						extra={<Button onClick={resetGame}>{MESSAGES.playAgain}</Button>}
					/>
				) : null}

				<Card size='small' title={MESSAGES.historyTitle}>
					<List
						dataSource={history}
						locale={{ emptyText: MESSAGES.emptyHistory }}
						renderItem={(item, index) => (
							<List.Item>
								<Space style={{ width: '100%', justifyContent: 'space-between' }}>
									<Text>Lượt {index + 1}: {item.value}</Text>
									<Tag color={item.result === 'correct' ? 'success' : item.result === 'low' ? 'blue' : 'volcano'}>
										{getResultText(item.result)}
									</Tag>
								</Space>
							</List.Item>
						)}
					/>
				</Card>
			</Space>
		</Card>
	);
};

export default DoanSo;
