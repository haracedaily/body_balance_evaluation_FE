"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Activity, FileText, Loader2, ChevronRight, ChevronLeft } from "lucide-react";

interface InbodyData {
  weight: string;
  skeletalMuscleMass: string;
  bodyFatMass: string;
  bodyFatPercentage: string;
  bmi: string;
}

interface SurveyData {
  painAreas: string;
  exerciseExperience: string;
  goals: string;
}

interface AnalysisResult {
  pose_analysis?: {
    shoulder_imbalance?: string;
    pelvis_tilt?: string;
    forward_head?: string;
  };
  recommendations?: {
    exercises?: string[];
    stretches?: string[];
  };
  summary?: string;
  [key: string]: unknown;
}

export default function HomePage() {
  const [step, setStep] = useState(1);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [sideImage, setSideImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);
  const [inbodyData, setInbodyData] = useState<InbodyData>({
    weight: "",
    skeletalMuscleMass: "",
    bodyFatMass: "",
    bodyFatPercentage: "",
    bmi: "",
  });
  const [surveyData, setSurveyData] = useState<SurveyData>({
    painAreas: "",
    exerciseExperience: "",
    goals: "",
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "side"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "front") {
        setFrontImage(file);
        setFrontPreview(URL.createObjectURL(file));
      } else {
        setSideImage(file);
        setSidePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleInbodyChange = (field: keyof InbodyData, value: string) => {
    setInbodyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSurveyChange = (field: keyof SurveyData, value: string) => {
    setSurveyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!frontImage) {
      setError("정면 사진을 업로드해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("front_image", frontImage);
    if (sideImage) {
      formData.append("side_image", sideImage);
    }
    formData.append("inbody_data", JSON.stringify(inbodyData));
    formData.append("survey_data", JSON.stringify(surveyData));

    try {
      const response = await axios.post(
        "http://localhost:8000/analysis/start",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
      setStep(4);
    } catch (err) {
      console.error(err);
      setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return frontImage !== null;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI 자세 분석 시스템</h1>
              <p className="text-sm text-muted-foreground">
                신체 균형 분석 및 운동/재활 루틴 추천
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 mx-1 transition-colors ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 text-sm text-muted-foreground mb-8">
          <span className={step === 1 ? "text-primary font-medium" : ""}>사진 업로드</span>
          <span className={step === 2 ? "text-primary font-medium" : ""}>인바디 데이터</span>
          <span className={step === 3 ? "text-primary font-medium" : ""}>설문</span>
          <span className={step === 4 ? "text-primary font-medium" : ""}>결과</span>
        </div>

        {/* Step 1: Image Upload */}
        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                전신 사진 업로드
              </CardTitle>
              <CardDescription>
                정면과 측면 사진을 업로드해주세요. 정면 사진은 필수입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Front Image */}
                <div className="space-y-3">
                  <Label htmlFor="front-image" className="text-base font-medium">
                    정면 사진 <span className="text-destructive">*</span>
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      frontPreview ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {frontPreview ? (
                      <div className="space-y-3">
                        <img
                          src={frontPreview}
                          alt="정면 미리보기"
                          className="max-h-48 mx-auto rounded-md object-contain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFrontImage(null);
                            setFrontPreview(null);
                          }}
                        >
                          다시 선택
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="front-image"
                        className="cursor-pointer block py-8"
                      >
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          클릭하여 사진 선택
                        </p>
                      </label>
                    )}
                    <input
                      id="front-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "front")}
                    />
                  </div>
                </div>

                {/* Side Image */}
                <div className="space-y-3">
                  <Label htmlFor="side-image" className="text-base font-medium">
                    측면 사진 (선택)
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      sidePreview ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {sidePreview ? (
                      <div className="space-y-3">
                        <img
                          src={sidePreview}
                          alt="측면 미리보기"
                          className="max-h-48 mx-auto rounded-md object-contain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSideImage(null);
                            setSidePreview(null);
                          }}
                        >
                          다시 선택
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="side-image"
                        className="cursor-pointer block py-8"
                      >
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          클릭하여 사진 선택
                        </p>
                      </label>
                    )}
                    <input
                      id="side-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "side")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Inbody Data */}
        {step === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                인바디 데이터 입력
              </CardTitle>
              <CardDescription>
                인바디 측정 결과를 입력해주세요. 입력하지 않아도 분석은 가능합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">체중 (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="예: 70"
                    value={inbodyData.weight}
                    onChange={(e) => handleInbodyChange("weight", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skeletal-muscle">골격근량 (kg)</Label>
                  <Input
                    id="skeletal-muscle"
                    type="number"
                    placeholder="예: 30"
                    value={inbodyData.skeletalMuscleMass}
                    onChange={(e) => handleInbodyChange("skeletalMuscleMass", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-fat-mass">체지방량 (kg)</Label>
                  <Input
                    id="body-fat-mass"
                    type="number"
                    placeholder="예: 15"
                    value={inbodyData.bodyFatMass}
                    onChange={(e) => handleInbodyChange("bodyFatMass", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-fat-percentage">체지방률 (%)</Label>
                  <Input
                    id="body-fat-percentage"
                    type="number"
                    placeholder="예: 20"
                    value={inbodyData.bodyFatPercentage}
                    onChange={(e) => handleInbodyChange("bodyFatPercentage", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bmi">BMI</Label>
                  <Input
                    id="bmi"
                    type="number"
                    placeholder="예: 22.5"
                    value={inbodyData.bmi}
                    onChange={(e) => handleInbodyChange("bmi", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Survey */}
        {step === 3 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                설문 작성
              </CardTitle>
              <CardDescription>
                더 정확한 분석을 위해 아래 정보를 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pain-areas">통증 부위</Label>
                <Textarea
                  id="pain-areas"
                  placeholder="예: 목, 어깨, 허리 등 평소 불편하거나 통증이 있는 부위를 적어주세요."
                  value={surveyData.painAreas}
                  onChange={(e) => handleSurveyChange("painAreas", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exercise-experience">운동 경험</Label>
                <Textarea
                  id="exercise-experience"
                  placeholder="예: 헬스 1년, 필라테스 6개월 등 운동 경험을 적어주세요."
                  value={surveyData.exerciseExperience}
                  onChange={(e) => handleSurveyChange("exerciseExperience", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">운동 목표</Label>
                <Textarea
                  id="goals"
                  placeholder="예: 자세 교정, 체중 감량, 근력 향상 등 원하는 목표를 적어주세요."
                  value={surveyData.goals}
                  onChange={(e) => handleSurveyChange("goals", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Results */}
        {step === 4 && result && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                분석 결과
              </CardTitle>
              <CardDescription>
                AI 기반 신체 균형 분석 및 운동 추천 결과입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary */}
                {result.summary && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">종합 요약</h3>
                    <p className="text-muted-foreground">{result.summary}</p>
                  </div>
                )}

                {/* Pose Analysis */}
                {result.pose_analysis && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">자세 분석</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {result.pose_analysis.shoulder_imbalance && (
                        <div className="p-3 border border-border rounded-lg">
                          <p className="text-sm text-muted-foreground">어깨 불균형</p>
                          <p className="font-medium">{result.pose_analysis.shoulder_imbalance}</p>
                        </div>
                      )}
                      {result.pose_analysis.pelvis_tilt && (
                        <div className="p-3 border border-border rounded-lg">
                          <p className="text-sm text-muted-foreground">골반 기울기</p>
                          <p className="font-medium">{result.pose_analysis.pelvis_tilt}</p>
                        </div>
                      )}
                      {result.pose_analysis.forward_head && (
                        <div className="p-3 border border-border rounded-lg">
                          <p className="text-sm text-muted-foreground">거북목</p>
                          <p className="font-medium">{result.pose_analysis.forward_head}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {result.recommendations.exercises && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">추천 운동</h3>
                        <ul className="space-y-2">
                          {result.recommendations.exercises.map((exercise, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 p-2 bg-muted rounded"
                            >
                              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                                {index + 1}
                              </span>
                              {exercise}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.recommendations.stretches && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">추천 스트레칭</h3>
                        <ul className="space-y-2">
                          {result.recommendations.stretches.map((stretch, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 p-2 bg-muted rounded"
                            >
                              <span className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs">
                                {index + 1}
                              </span>
                              {stretch}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Raw Data (for debugging) */}
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    원본 데이터 보기
                  </summary>
                  <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto text-xs">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex justify-center gap-4 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                이전
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                다음
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    분석 시작
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Reset Button for Results */}
        {step === 4 && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => {
                setStep(1);
                setResult(null);
                setFrontImage(null);
                setSideImage(null);
                setFrontPreview(null);
                setSidePreview(null);
                setInbodyData({
                  weight: "",
                  skeletalMuscleMass: "",
                  bodyFatMass: "",
                  bodyFatPercentage: "",
                  bmi: "",
                });
                setSurveyData({
                  painAreas: "",
                  exerciseExperience: "",
                  goals: "",
                });
              }}
            >
              새로운 분석 시작
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            ※ 본 시스템은 의료 진단 시스템이 아니며, 운동 보조 및 자세 분석 목적으로만 사용됩니다.
          </p>
        </div>
      </footer>
    </main>
  );
}
