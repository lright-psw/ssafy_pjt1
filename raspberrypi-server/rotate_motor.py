import RPi.GPIO as GPIO
import sys
import time

servo_pin = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(servo_pin, GPIO.OUT)

# PWM: 주파수 50Hz
pwm = GPIO.PWM(servo_pin, 50)
pwm.start(0)

def move_motor(angle):
    # 안전한 각도 범위 제한 (10도 ~ 170도 사이만 허용)
    safe_angle = max(10, min(170, angle))

    # 각도를 듀티 사이클로 변환 (모터에 따라 값 조정 가능)
    duty = (safe_angle / 18.0) + 2.5

    print(f"→ 이동 각도: {safe_angle}°, 듀티 사이클: {duty:.2f}")
    pwm.ChangeDutyCycle(duty)
    time.sleep(0.5)
    pwm.ChangeDutyCycle(0)  # 움직임 멈춤

if __name__ == "__main__":
    try:
        angle = int(sys.argv[1])
        move_motor(angle)
        print(f"모터 {angle}°로 이동 완료")
    except Exception as e:
        print("오류 발생:", e)
    finally:
        pwm.stop()