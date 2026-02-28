import React, { useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import { AppBoldText, AppRegularText, AppSemiBoldText } from '../../styles/fonts';

const AI_ASK_URL = 'https://ragaibot-production.up.railway.app/ai_chat/ask';
const AI_API_KEY = 'd54b307bf34ed2de1a84864714213e8a8fd12c29c47279e3ec4e72e67f66771b';

function extractTextFromResponse(data) {
  if (typeof data === 'string') return data;
  if (!data || typeof data !== 'object') return '';

  const candidates = [
    data.answer,
    data.response,
    data.message,
    data.result,
    data.output,
    data.text,
    data?.data?.answer,
    data?.data?.response,
    data?.data?.message,
  ];

  const found = candidates.find((item) => typeof item === 'string' && item.trim() !== '');
  if (found) return found;

  try {
    return JSON.stringify(data, null, 2);
  } catch (err) {
    return '';
  }
}

function sanitizeQuestionPayload(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;

  const type = String(parsed.type || '').toUpperCase();
  const validTypes = ['MCQ', 'SINGLE', 'BOOLEAN', 'FILL_BLANK', 'MATCHING'];
  if (!validTypes.includes(type)) return null;

  if (typeof parsed.questionText !== 'string' || !Array.isArray(parsed.options)) return null;

  const sanitized = {
    marks: Number(parsed.marks) || 0,
    questionText: parsed.questionText,
    type,
    options: parsed.options
      .filter((opt) => opt && typeof opt.optionText === 'string')
      .map((opt) => {
        const base = {
          optionText: opt.optionText,
          optionMark: Number(opt.optionMark) || 0,
        };

        if (type === 'MATCHING' && opt.matchingOptionProperties) {
          return {
            ...base,
            matchingOptionProperties: opt.matchingOptionProperties,
          };
        }

        if (type === 'FILL_BLANK' && opt.blankOptionProperties) {
          return {
            ...base,
            blankOptionProperties: opt.blankOptionProperties,
          };
        }

        return {
          ...base,
          correct: !!opt.correct,
        };
      }),
  };

  if (sanitized.options.length === 0) return null;
  return sanitized;
}

function extractFirstJsonBlock(text, startChar, endChar) {
  if (!text || typeof text !== 'string') return null;
  const start = text.indexOf(startChar);
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === startChar) depth += 1;
    if (ch === endChar) depth -= 1;
    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }
  return null;
}

function parseJsonSafe(text) {
  if (!text || typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

function tryParseQuestionPayload(input) {
  if (!input) return null;

  if (typeof input === 'object') {
    const direct = sanitizeQuestionPayload(input);
    if (direct) return direct;
  }

  if (typeof input !== 'string') return null;
  const normalized = input.trim();
  const fenced = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? normalized;

  const candidates = [
    raw,
    raw.replace(/[“”]/g, '"').replace(/[‘’]/g, "'"),
    extractFirstJsonBlock(raw, '{', '}'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const parsed = parseJsonSafe(candidate);
    const sanitized = sanitizeQuestionPayload(parsed);
    if (sanitized) return sanitized;
  }
  return null;
}

function tryParseQuestionPayloadArray(input) {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeQuestionPayload(item)).filter(Boolean);
  }

  if (typeof input !== 'string') return [];
  const normalized = input.trim();
  const fenced = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? normalized;

  const candidates = [
    raw,
    raw.replace(/[“”]/g, '"').replace(/[‘’]/g, "'"),
    extractFirstJsonBlock(raw, '[', ']'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const parsed = parseJsonSafe(candidate);
    if (!Array.isArray(parsed)) continue;
    const sanitized = parsed.map((item) => sanitizeQuestionPayload(item)).filter(Boolean);
    if (sanitized.length > 0) return sanitized;
  }

  return [];
}

function parseQuestionListFromApiData(data) {
  const directList = tryParseQuestionPayloadArray(data);
  if (directList.length > 0) return directList;

  const directOne = tryParseQuestionPayload(data);
  if (directOne) return [directOne];

  if (!data || typeof data !== 'object') return [];

  const candidates = [
    data.questions,
    data.data?.questions,
    data.answer,
    data.response,
    data.message,
    data.result,
    data.output,
    data.text,
    data.data,
    data?.data?.answer,
    data?.data?.response,
    data?.data?.message,
    data?.data?.result,
    data?.data?.output,
    data?.data?.text,
  ];

  for (const candidate of candidates) {
    const parsedList = tryParseQuestionPayloadArray(candidate);
    if (parsedList.length > 0) return parsedList;

    const parsedOne = tryParseQuestionPayload(candidate);
    if (parsedOne) return [parsedOne];
  }

  return [];
}

function getPreviewQuestionText(question) {
  if (!question || question.type !== 'FILL_BLANK' || typeof question.questionText !== 'string') {
    return question?.questionText || '';
  }

  const parts = question.questionText.split('__BLANK__');
  if (parts.length <= 1) return question.questionText;

  const answersByIndex = {};
  (question.options || []).forEach((option, optionIdx) => {
    const blankIdx = Number(option?.blankOptionProperties?.blankIdx);
    const answerText = option?.blankOptionProperties?.blankText || option?.optionText || '';

    if (Number.isFinite(blankIdx) && blankIdx > 0) {
      answersByIndex[blankIdx - 1] = answerText;
      return;
    }

    if (answersByIndex[optionIdx] === undefined) {
      answersByIndex[optionIdx] = answerText;
    }
  });

  let formatted = '';
  for (let i = 0; i < parts.length - 1; i += 1) {
    formatted += parts[i];
    formatted += answersByIndex[i] ?? '__BLANK__';
  }
  formatted += parts[parts.length - 1];

  return formatted;
}

export default function AIQuestionGeneratorBot({ onUseQuestion }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const askAi = async () => {
    setError('');
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(AI_ASK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt.trim()}\n\nReturn JSON only. Prefer an array of questions. Each question must contain keys: marks, questionText, type, options.`,
          'x-api-key': AI_API_KEY,
        }),
      });

      const text = await response.text();
      let data = text;

      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        // API may return plain text, keep as-is.
      }

      if (!response.ok) {
        const message = extractTextFromResponse(data) || `Request failed (${response.status})`;
        setError(message);
        return;
      }

      const generatedQuestions = parseQuestionListFromApiData(data);
      if (generatedQuestions.length === 0) {
        const responseText = extractTextFromResponse(data);
        console.log('AI raw response:', responseText);
        setError('Could not parse AI JSON.');
        return;
      }

      setGeneratedQuestions(generatedQuestions);
    } catch (err) {
      setError('Failed to contact AI service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addGeneratedQuestion = async () => {
    if (generatedQuestions.length === 0) {
      setError('Generate a question first.');
      return;
    }

    try {
      setSaving(true);
      await onUseQuestion(generatedQuestions);
      setGeneratedQuestions([]);
      setPrompt('');
      setIsOpen(false);
    } catch (saveErr) {
      setError('Question generation worked, but saving question failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Pressable
        style={styles.fab}
        onPress={() => {
          setError('');
          setIsOpen(true);
        }}
      >
        <Ionicons name="sparkles-outline" size={22} color={Colors.primaryColor} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.headerRow}>
              <View style={styles.titleRow}>
                <AntDesign name="robot" size={20} color={Colors.primaryColor} />
                <AppBoldText style={styles.title}>Ask. Analyze. Achieve.</AppBoldText>
              </View>
              <Pressable onPress={() => setIsOpen(false)}>
                <AntDesign name="close" size={20} color={Colors.secondaryColor} />
              </Pressable>
            </View>

            <AppSemiBoldText style={styles.label}>Create</AppSemiBoldText>
            <TextInput
              style={styles.input}
              multiline
              value={prompt}
              onChangeText={(value) => {
                setPrompt(value);
                setError('');
              }}
              placeholder="Generate one MCQ on Operating Systems ...."
              placeholderTextColor={Colors.lightFont}
            />

            {generatedQuestions.length > 0 ? (
              <View style={styles.previewCard}>
                <AppSemiBoldText style={styles.previewTitle}>
                  Generated Questions ({generatedQuestions.length})
                </AppSemiBoldText>
                <ScrollView style={styles.previewScroll}>
                  {generatedQuestions.map((question, index) => (
                    <View key={`generated-question-${index}`} style={styles.previewQuestionCard}>
                      <AppSemiBoldText style={styles.previewQuestionTitle}>
                        Q{index + 1}. {getPreviewQuestionText(question)}
                      </AppSemiBoldText>
                      <AppRegularText style={styles.previewMeta}>
                        Type: {question.type} | Marks: {question.marks}
                      </AppRegularText>

                      {question.options?.map((option, optionIdx) => {
                        const isCorrect = !!option.correct
                          || !!option.isCorrect
                          || !!option.blankOptionProperties?.blankText
                          || !!option.matchingOptionProperties?.match;

                        let answerText = option.optionText;
                        if (question.type === 'FILL_BLANK') {
                          answerText = option.blankOptionProperties?.blankText || option.optionText;
                        } else if (question.type === 'MATCHING') {
                          const right = option.matchingOptionProperties?.match;
                          answerText = right
                            ? `${option.optionText} -> ${right}`
                            : option.optionText;
                        }

                        return (
                          <AppRegularText key={`generated-option-${index}-${optionIdx}`} style={styles.previewOption}>
                            {isCorrect ? '✓ ' : '• '}
                            {answerText}
                          </AppRegularText>
                        );
                      })}
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.actionRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setIsOpen(false)}>
                <AppRegularText>Close</AppRegularText>
              </Pressable>
              <Pressable style={styles.askBtn} onPress={askAi}>
                {loading || saving ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <AppRegularText style={{ color: Colors.white }}>
                    {generatedQuestions.length > 0 ? 'Regenerate' : 'Generate'}
                  </AppRegularText>
                )}
              </Pressable>
              {generatedQuestions.length > 0 ? (
                <Pressable style={styles.addBtn} onPress={addGeneratedQuestion}>
                  {saving ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <AppRegularText style={{ color: Colors.white }}>Add Questions</AppRegularText>
                  )}
                </Pressable>
              ) : null}
            </View>

            {!!error && <AppSemiBoldText style={styles.error}>{error}</AppSemiBoldText>}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondaryColor , //'#52465C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    ...(Platform.OS === 'web' ? { boxShadow: Colors.blackBoxShadow } : {}),
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.dimBg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  modalCard: {
    width: '100%',
    maxWidth: 760,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 18,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Colors.secondaryColor,
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    color: Colors.secondaryColor,
  },
  input: {
    minHeight: 90,
    maxHeight: 180,
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    color: Colors.secondaryColor,
    backgroundColor: Colors.bgColor,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    backgroundColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  askBtn: {
    minWidth: 88,
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtn: {
    minWidth: 110,
    alignItems: 'center',
    backgroundColor: '#3A7D44',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  previewCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.bgColor,
    padding: 10,
    gap: 4,
  },
  previewScroll: {
    maxHeight: 260,
  },
  previewTitle: {
    color: Colors.secondaryColor,
    fontSize: 13,
  },
  previewQuestionCard: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    paddingTop: 8,
  },
  previewQuestionTitle: {
    color: Colors.secondaryColor,
    fontSize: 14,
  },
  previewMeta: {
    color: Colors.lightFont,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
  },
  previewOption: {
    color: Colors.secondaryColor,
    fontSize: 13,
    marginTop: 2,
  },
  error: {
    color: '#DC2626',
    fontSize: 13,
  },
});
