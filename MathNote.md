核心数学方程

# 一、二次曲线的一般方程系数
这是一个非常经典且富有深度的问题。你提到的“包含平移、旋转、不等比缩放、反射的矩阵”，在数学上通常指的是**仿射变换**。

要将一个已知的标准二次曲线通过这样的变换，计算出新的一般方程系数，核心是理解**坐标变换**与**系数变换**的关系。

以下是完整的数学推导和计算步骤。


## 1. 问题建模

假设我们有一个标准二次曲线，通常写成矩阵形式：
```math
\mathbf{x}^T \mathbf{Q} \mathbf{x} = 0
```

其中 
```math
\mathbf{x} = \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}
```
是齐次坐标， $\mathbf{Q}$ 是一个 $3 \times 3$ 的对称矩阵，包含了二次项、一次项和常数项的系数。

例如，对于中心在原点的椭圆 $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$（等价于 $\frac{x^2}{a^2} + \frac{y^2}{b^2} - 1 = 0$），其矩阵形式为：
```math
\begin{bmatrix} x & y & 1 \end{bmatrix}
\begin{bmatrix}
\frac{1}{a^2} & 0 & 0 \\
0 & \frac{1}{b^2} & 0 \\
0 & 0 & -1
\end{bmatrix}
\begin{bmatrix} x \\ y \\ 1 \end{bmatrix} = 0
```

现在，我们想对这个曲线上的每个点施加一个变换矩阵 $\mathbf{T}$（ $3 \times 3$ 的仿射变换矩阵，包含平移、旋转、缩放、反射）。

设原曲线上的点为 $\mathbf{x}\_{old}$ ，变换后的点为 $\mathbf{x}\_{new}$ ，则有：
```math
\mathbf{x}_{old} = \mathbf{T}^{-1} \mathbf{x}_{new}
```

## 2. 核心推导：系数矩阵的变换规律

将 $\mathbf{x}\_{old} = \mathbf{T}^{-1} \mathbf{x}\_{new}$ 代入原方程：
```math
(\mathbf{T}^{-1} \mathbf{x}_{new})^T \mathbf{Q}_{old} (\mathbf{T}^{-1} \mathbf{x}_{new}) = 0
```
```math
\mathbf{x}_{new}^T (\mathbf{T}^{-T} \mathbf{Q}_{old} \mathbf{T}^{-1}) \mathbf{x}_{new} = 0
```

由此得出，变换后的新曲线方程为：
```math
\mathbf{x}^T \mathbf{Q}_{new} \mathbf{x} = 0
```
其中：
```math
\boxed{\mathbf{Q}_{new} = \mathbf{T}^{-T} \mathbf{Q}_{old} \mathbf{T}^{-1}}
```

-   $\mathbf{Q}\_{old}$：原曲线的系数矩阵（已知）。
-   $\mathbf{T}$：你定义的变换矩阵（已知，$3 \times 3$ 仿射矩阵）。
-   $\mathbf{T}^{-T}$：先求逆，再转置（或者先转置再求逆，结果一样）。
-   $\mathbf{Q}\_{new}$：新曲线的系数矩阵。

## 3. 计算步骤

假设你有一个变换 $\mathbf{T}$ ，将旧坐标 $(x\_{old}, y\_{old})$ 映射到新坐标 $(x\_{new}, y\_{new})$：

```math
\begin{bmatrix} x_{new} \\ y_{new} \\ 1 \end{bmatrix} =
\begin{bmatrix}
a & b & t_x \\
c & d & t_y \\
0 & 0 & 1
\end{bmatrix}
\cdot
\begin{bmatrix} x_{old} \\ y_{old} \\ 1 \end{bmatrix}
```

其中
```math
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
``` 
部分包含了**旋转、不等比缩放、反射**， $(t_x, t_y)$ 是**平移**。

### 步骤 1：写出原曲线矩阵 $\mathbf{Q}_{old}$
假设原曲线是：
```math
A_{old}x^2 + B_{old}xy + C_{old}y^2 + D_{old}x + E_{old}y + F_{old} = 0
```
对应的对称矩阵为：
```math
\mathbf{Q}_{old} =
\begin{bmatrix}
A_{old} & B_{old}/2 & D_{old}/2 \\
B_{old}/2 & C_{old} & E_{old}/2 \\
D_{old}/2 & E_{old}/2 & F_{old}
\end{bmatrix}
```
注意：矩阵中的系数对应关系是，当展开 $\mathbf{x}^T\mathbf{Q}\mathbf{x}$ 时，二次项系数正确出现。

### 步骤 2：求变换矩阵的逆 $\mathbf{T}^{-1}$
对于仿射矩阵，逆矩阵公式为：
```math
\mathbf{T}^{-1} = 
\begin{bmatrix}
a & b & t_x \\
c & d & t_y \\
0 & 0 & 1
\end{bmatrix}^{-1} = 
\begin{bmatrix}
\frac{d}{\Delta} & \frac{-b}{\Delta} & \frac{b t_y - d t_x}{\Delta} \\
\frac{-c}{\Delta} & \frac{a}{\Delta} & \frac{c t_x - a t_y}{\Delta} \\
0 & 0 & 1
\end{bmatrix}
```
其中 $\Delta = ad - bc$（线性部分的行列式）。

### 步骤 3：计算 $\mathbf{Q}\_{new} = \mathbf{T}^{-T} \mathbf{Q}\_{old} \mathbf{T}^{-1}$
这是一个 $3 \times 3$ 矩阵乘法。结果 $\mathbf{Q}_{new}$ 将是一个对称矩阵。

### 步骤 4：提取新系数
根据 $\mathbf{Q}\_{new}$ 的对应位置提取新方程的系数：

-   $A_{new} = \mathbf{Q}_{new}[1,1]$
-   $B_{new} = 2 \times \mathbf{Q}_{new}[1,2]$ （因为矩阵的 (1,2) 项存储的是 $B/2$）
-   $C_{new} = \mathbf{Q}_{new}[2,2]$
-   $D_{new} = 2 \times \mathbf{Q}_{new}[1,3]$
-   $E_{new} = 2 \times \mathbf{Q}_{new}[2,3]$
-   $F_{new} = \mathbf{Q}_{new}[3,3]$


## 总结
1.  **使用齐次坐标**和 $3\times 3$ 矩阵 $\mathbf{Q}$ 来表示二次曲线。
2.  **变换公式**： $\mathbf{Q}\_{new} = \mathbf{T}^{-T} \mathbf{Q}\_{old} \mathbf{T}^{-1}$  。
3.  无论变换多么复杂（平移、旋转、不等比缩放、反射），这个公式都能直接给出新的一般方程系数。


# 二、二次曲线的格林公式积分

## 概述
计算闭合曲线的有向面积。可以获得面积的大小，同时根据面积的符号判断轮廓的绕向，面积 > 0 时正向，面积 < 0 时反向。

## 核心公式

设闭合环由 $n$ 段曲线组成，第 $i$ 段在**局部坐标系**下的有向面积贡献为 $I_{\text{local},i}$（由前面的标准公式给出），该段到全局坐标系的仿射变换为：

```math
\mathbf{x}_{\text{global}} = \mathbf{M}_i \mathbf{x}_{\text{local}} + \mathbf{t}_i
```

则该段对全局有向面积的贡献为：

```math
\boxed{I_{\text{global},i} = \det(\mathbf{M}_i) \cdot I_{\text{local},i}}
```

最终整个环的总有向面积为：

```math
\boxed{I_{\text{total}} = \sum_{i=1}^{n} \det(\mathbf{M}_i) \cdot I_{\text{local},i}}
```

其中， 
```math
\mathbf{M} = \begin{pmatrix} a & b \\ c & d \end{pmatrix}  
```
行列式 $\Delta = ad - bc$ 。

**分段计算公式：**
```math
\boxed{I_{\text{world}} = \Delta \cdot I_{\text{local}} + \frac{1}{2} \left( T_x \Delta Y - T_y \Delta X \right)}
```


在**标准方程**（中心/顶点在原点，无平移，无旋转）下，圆锥曲线的有向面积积分具有简洁的解析形式。

有向面积贡献公式：

```math
I = \frac{1}{2} \int_{t_1}^{t_2} \left( x \frac{dy}{dt} - y \frac{dx}{dt} \right) dt
```


## 有向面积积分结果

| 曲线 | 参数方程 | 积分结果 $I$ |
| --- | --- | --- |
| 直线 | $x = x_1 + (x_2-x_1)t,\ y = y_1 + (y_2-y_1)t$ | $\frac{1}{2}(x_1y_2 - x_2y_1)$ |
| 圆 | $(r\cos\theta,\ r\sin\theta)$ | $\frac{1}{2}r^2(\theta_2 - \theta_1)$ |
| 椭圆 | $(a\cos\theta,\ b\sin\theta)$ | $\frac{1}{2}ab(\theta_2 - \theta_1)$ |
| 抛物线 $y^2=4px$ | $(pt^2,\ 2pt)$ | $-\frac{p^2}{3}(t_2^3 - t_1^3)$ |
| 抛物线 $x^2=4py$ | $(2pt,\ pt^2)$ | $\frac{p^2}{3}(t_2^3 - t_1^3)$ |
| 双曲线（双曲函数） | $(a\cosh u,\ b\sinh u)$ | $\frac{ab}{2}(u_2 - u_1)$ |
| 双曲线（正割/正切） | $(a\sec\phi,\ b\tan\phi)$ | $\frac{ab}{2} \ln\|\frac{\sec\phi_2 + \tan\phi_2}{\sec\phi_1 + \tan\phi_1} \|$ |



# 三、三次方求解
好的，我来详细推导三次方程判别式 \(\Delta\) 在不同情况下的计算公式。

---

## 1. 三次方程的标准形式

对于归一化三次方程：
\[
\lambda^3 + a\lambda^2 + b\lambda + c = 0
\]

---

## 2. 判别式 \(\Delta\) 的通用公式

\[
\boxed{
\Delta = 18abc - 4a^3c + a^2b^2 - 4b^3 - 27c^2
}
\]

这是**完整公式**，适用于所有三次方程，无论 \(\Delta\) 的符号如何。

---

## 3. 消去二次项后的形式

令 \(\lambda = x - \frac{a}{3}\)，方程变为：
\[
x^3 + px + q = 0
\]

其中：
\[
p = b - \frac{a^2}{3}
\]
\[
q = \frac{2a^3}{27} - \frac{ab}{3} + c
\]

此时判别式简化为：
\[
\boxed{
\Delta = -4p^3 - 27q^2
}
\]

或者等价地：
\[
\boxed{
\Delta = -4\left(b - \frac{a^2}{3}\right)^3 - 27\left(\frac{2a^3}{27} - \frac{ab}{3} + c\right)^2
}
\]

---

## 4. \(\Delta\) 的三种情况

### 4.1 \(\Delta > 0\)：三个不同的实根

当判别式大于零时：
- 方程有三个**不同的实数根**
- 这是最"正常"的情况

**几何意义**：三个实 \(\lambda\) 对应三对实直线，覆盖所有交点组合。

**根的形式**：
\[
x_1 = 2\sqrt[3]{R} \cos\left(\frac{\theta}{3}\right)
\]
\[
x_2 = 2\sqrt[3]{R} \cos\left(\frac{\theta + 2\pi}{3}\right)
\]
\[
x_3 = 2\sqrt[3]{R} \cos\left(\frac{\theta + 4\pi}{3}\right)
\]

其中：
\[
R = \sqrt{\frac{-p^3}{27}}, \quad \theta = \arccos\left(\frac{-q}{2R}\right)
\]

然后回代 \(\lambda = x - \frac{a}{3}\)。

---

### 4.2 \(\Delta = 0\)：有重根

当判别式等于零时，方程有**重根**（至少两个根相等）。

#### 情况 1：\(p = 0, q = 0\)（三重根）
\[
x_1 = x_2 = x_3 = 0
\]
\[
\lambda_1 = \lambda_2 = \lambda_3 = -\frac{a}{3}
\]

#### 情况 2：\(p \neq 0\)（一个二重根 + 一个单根）
\[
x_1 = 3\sqrt[3]{\frac{-q}{2}}, \quad x_2 = x_3 = -3\sqrt[3]{\frac{-q}{4}}
\]

**几何意义**：两条曲线相切（有重交点）。

---

### 4.3 \(\Delta < 0\)：一个实根 + 两个复根

当判别式小于零时：
- 方程有 **1 个实数根**
- 2 个共轭复数根

**几何意义**：只有一个实 \(\lambda\) 对应实退化直线对。

**根的形式**：
\[
x_1 = \sqrt[3]{\frac{-q}{2} + \sqrt{-\frac{\Delta}{108}}} + \sqrt[3]{\frac{-q}{2} - \sqrt{-\frac{\Delta}{108}}}
\]
\[
x_2 = -\frac{x_1}{2} + i\frac{\sqrt{3}}{2} \cdot \sqrt[3]{\frac{-q}{2} + \sqrt{-\frac{\Delta}{108}}} - \sqrt[3]{\frac{-q}{2} - \sqrt{-\frac{\Delta}{108}}}
\]
\[
x_3 = -\frac{x_1}{2} - i\frac{\sqrt{3}}{2} \cdot \sqrt[3]{\frac{-q}{2} + \sqrt{-\frac{\Delta}{108}}} - \sqrt[3]{\frac{-q}{2} - \sqrt{-\frac{\Delta}{108}}}
\]

---

## 5. 快速判断方法

### 5.1 通过系数判断

对于方程 \(x^3 + px + q = 0\)：

| 条件 | 根的情况 |
|------|---------|
| \(\Delta > 0\) | 三个不同实根 |
| \(\Delta = 0, p = q = 0\) | 三重根 |
| \(\Delta = 0, p \neq 0\) | 二重根 + 单根 |
| \(\Delta < 0\) | 一个实根 + 两个复根 |

---

## 6. 快速判断表

| Δ 的符号 | 根的情况 | 几何意义（二次曲线） |
|---------|---------|-------------------|
| **Δ > 0** | 3个不同实根 | 3个实退化二次曲线 |
| **Δ = 0** | 有重根 | 相切/退化情况 |
| **Δ < 0** | 1实根+2复根 | 只有1个实退化二次曲线 |

---

## 7. 总结

对于三次方程 \(\lambda^3 + a\lambda^2 + b\lambda + c = 0\)：

**通用判别式**：
\[
\Delta = 18abc - 4a^3c + a^2b^2 - 4b^3 - 27c^2
\]

**根的情况**：
- \(\Delta > 0\)：3个实根
- \(\Delta = 0\)：有重根
- \(\Delta < 0\)：1个实根 + 2个复根

---

# 四、四次方程的求解

---

## 1. 标准形式

一元四次方程的一般形式：
\[
a x^4 + b x^3 + c x^2 + d x + e = 0 \quad (a \neq 0)
\]

---

## 2. 求解步骤

### 第一步：归一化

除以 \(a\)，得到：
\[
x^4 + p x^3 + q x^2 + r x + s = 0
\]

其中：
\[
p = \frac{b}{a},\quad q = \frac{c}{a},\quad r = \frac{d}{a},\quad s = \frac{e}{a}
\]

---

### 第二步：代换 \(x = y - \frac{p}{4}\)，消去三次项

令：
\[
x = y - \frac{p}{4}
\]

代入后得到**缺项四次方程**：
\[
y^4 + A y^2 + B y + C = 0
\]

其中：
\[
A = q - \frac{3p^2}{8}
\]
\[
B = r + \frac{p^3}{8} - \frac{pq}{2}
\]
\[
C = s - \frac{3p^4}{256} + \frac{p^2 q}{16} - \frac{p r}{4}
\]

---

### 第三步：特殊情况检测

#### 情况 1：\(B = 0\)

方程退化为：
\[
y^4 + A y^2 + C = 0
\]

令 \(z = y^2\)，得到二次方程：
\[
z^2 + A z + C = 0
\]

解出 \(z\)，然后 \(y = \pm \sqrt{z}\)。

#### 情况 2：\(A = 0\) 且 \(B = 0\)

方程退化为：
\[
y^4 + C = 0
\]

直接解：
\[
y = \pm \sqrt[4]{-C},\quad y = \pm i \sqrt[4]{-C}
\]

---

### 第四步：构造三次预解方程（Ferrari 方法）

对于一般情况 \(B \neq 0\)，构造三次预解方程：
\[
m^3 - \frac{A}{2} m^2 - C m + \left(\frac{AC}{2} - \frac{B^2}{8}\right) = 0
\]

即：
\[
m^3 + \alpha m^2 + \beta m + \gamma = 0
\]

其中：
\[
\alpha = -\frac{A}{2},\quad \beta = -C,\quad \gamma = \frac{AC}{2} - \frac{B^2}{8}
\]

---

### 第五步：解三次预解方程

用三次方程求解器（Cardano 公式）解出三个根 \(m_1, m_2, m_3\)。

选择**一个实数根** \(m\)（通常选择绝对值最小的实数根，以获得数值稳定性）。

---

### 第六步：计算 \(\alpha\) 和 \(\beta\)

\[
\alpha = \sqrt{2m - A}
\]
\[
\beta = \sqrt{m^2 - C}
\]

**注意**：如果 \(2m - A < 0\)，\(\alpha\) 是虚数；如果 \(m^2 - C < 0\)，\(\beta\) 是虚数。

---

### 第七步：确定 \(\beta\) 的符号

\[
\beta = \text{sign}(B) \cdot \sqrt{m^2 - C}
\]

即：
- 如果 \(B \ge 0\)，\(\beta = \sqrt{m^2 - C}\)
- 如果 \(B < 0\)，\(\beta = -\sqrt{m^2 - C}\)

---

### 第八步：解两个二次方程

#### 方程 1：
\[
y^2 - \alpha y + (m + \beta) = 0
\]

判别式：
\[
\Delta_1 = \alpha^2 - 4(m + \beta)
\]

#### 方程 2：
\[
y^2 + \alpha y + (m - \beta) = 0
\]

判别式：
\[
\Delta_2 = \alpha^2 - 4(m - \beta)
\]

---

### 第九步：求解二次方程

#### 如果判别式是实数且 \(\Delta \ge 0\)：
\[
y = \frac{-\alpha \pm \sqrt{\Delta}}{2}
\]

#### 如果判别式是实数且 \(\Delta < 0\)：
\[
y = \text{real} \pm i \cdot \text{imag}
\]
其中：
\[
\text{real} = -\frac{\alpha}{2},\quad \text{imag} = \frac{\sqrt{-\Delta}}{2}
\]

#### 如果判别式是复数：
直接使用复数公式：
\[
y = \frac{-\alpha \pm \sqrt{\Delta}}{2}
\]

---

### 第十步：回代

\[
x = y - \frac{p}{4}
\]

---

## 3. 完整流程图

```
开始
  ↓
输入 a, b, c, d, e
  ↓
归一化: x⁴ + px³ + qx² + rx + s = 0
  ↓
代换: x = y - p/4
  ↓
得到缺项方程: y⁴ + Ay² + By + C = 0
  ↓
B = 0? ───→ 是 ───→ 解 z² + Az + C = 0 → y = ±√z → 回代
  ↓ 否
构造三次预解方程
  ↓
解三次方程，选择实数根 m
  ↓
计算 α = √(2m-A), β = √(m²-C)
  ↓
调整 β 的符号: sign(B)
  ↓
解二次方程 y² - αy + (m+β) = 0
  ↓
解二次方程 y² + αy + (m-β) = 0
  ↓
合并 4 个根
  ↓
回代: x = y - p/4
  ↓
返回结果
```

---

## 4. 代码实现要点

### 要点 1：判别式类型判断

```javascript
if (MATHJS.typeOf(Δ1) === 'Complex') {
  // 复数判别式
  const sqrtDisc = MATHJS.sqrt(Δ1);
  const root1 = MATHJS.divide(MATHJS.add(alpha, sqrtDisc), 2);
  const root2 = MATHJS.divide(MATHJS.subtract(alpha, sqrtDisc), 2);
} else if (MATHJS.largerEq(Δ1, ZERO)) {
  // 实数判别式 >= 0
  const sqrtDisc = MATHJS.sqrt(Δ1);
  const root1 = MATHJS.divide(MATHJS.add(alpha, sqrtDisc), 2);
  const root2 = MATHJS.divide(MATHJS.subtract(alpha, sqrtDisc), 2);
} else {
  // 实数判别式 < 0
  const realPart = MATHJS.divide(alpha, 2);
  const imagPart = MATHJS.divide(MATHJS.sqrt(MATHJS.unaryMinus(Δ1)), 2);
  const root1 = MATHJS.complex(realPart.toNumber(), imagPart.toNumber());
  const root2 = MATHJS.complex(realPart.toNumber(), -imagPart.toNumber());
}
```

### 要点 2：\(\alpha\) 的类型处理

如果 \(\alpha\) 是复数，实数判别式分支需要特殊处理：

```javascript
if (MATHJS.typeOf(alpha) === 'Complex') {
  // 使用复数公式
  const sqrtDisc = MATHJS.sqrt(MATHJS.unaryMinus(Δ));
  const root1 = MATHJS.divide(MATHJS.add(alpha, sqrtDisc), 2);
  const root2 = MATHJS.divide(MATHJS.subtract(alpha, sqrtDisc), 2);
} else {
  // alpha 是实数
  const realPart = MATHJS.subtract(MATHJS.divide(alpha, 2), p_4);
  const imagPart = MATHJS.divide(MATHJS.sqrt(MATHJS.unaryMinus(Δ)), 2);
  // ...
}
```

### 要点 3：特殊情况优化

当 \(B = 0\) 时，直接解二次方程 \(z^2 + Az + C = 0\)，避免 Ferrari 方法的复杂逻辑和数值不稳定。

---

## 5. 总结

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1 | 归一化 | 使最高次项系数为 1 |
| 2 | 消去三次项 | 代换 \(x = y - p/4\) |
| 3 | 检测特殊情况 | \(B = 0\) 时直接解二次方程 |
| 4 | 构造三次预解方程 | Ferrari 方法 |
| 5 | 解三次方程 | 选择实数根 |
| 6 | 计算 \(\alpha, \beta\) | 可能需要复数运算 |
| 7 | 解两个二次方程 | 得到 4 个根 |
| 8 | 回代 | \(x = y - p/4\) |

**Ferrari 方法的关键**：通过引入参数 \(m\)，将四次方程分解为两个二次方程，从而将问题降阶。


# 五、曲线交点的结式多项式计算

## 1. 两条曲线的多项式形式

对于两条二次曲线：
\[
F_1(x,y) = a_1x^2 + b_1xy + c_1y^2 + d_1x + e_1y + f_1 = 0
\]
\[
F_2(x,y) = a_2x^2 + b_2xy + c_2y^2 + d_2x + e_2y + f_2 = 0
\]

将 \(y\) 视为参数，\(x\) 视为变量，写成关于 \(x\) 的多项式：
\[
F_1 = A_1 x^2 + B_1 x + C_1
\]
\[
F_2 = A_2 x^2 + B_2 x + C_2
\]

其中：
\[
A_1 = a_1,\quad B_1 = b_1 y + d_1,\quad C_1 = c_1 y^2 + e_1 y + f_1
\]
\[
A_2 = a_2,\quad B_2 = b_2 y + d_2,\quad C_2 = c_2 y^2 + e_2 y + f_2
\]

---

## 2. 结式定义

两个二次多项式 \(F_1 = A_1 x^2 + B_1 x + C_1\) 和 \(F_2 = A_2 x^2 + B_2 x + C_2\) 的结式为：
\[
\text{Res}_x(F_1, F_2) = \det
\begin{bmatrix}
A_1 & B_1 & C_1 & 0 & 0 \\
0 & A_1 & B_1 & C_1 & 0 \\
0 & 0 & A_1 & B_1 & C_1 \\
A_2 & B_2 & C_2 & 0 & 0 \\
0 & A_2 & B_2 & C_2 & 0 \\
0 & 0 & A_2 & B_2 & C_2
\end{bmatrix}
\]

这个 5×5 矩阵的行列式展开后，得到一个关于 \(y\) 的**四次多项式**：
\[
R(y) = R_4 y^4 + R_3 y^3 + R_2 y^2 + R_1 y + R_0
\]

---

## 3. 推导 \(R_4, R_3, R_2, R_1, R_0\)

虽然 5×5 行列式展开非常冗长，但可以分步计算。

### 方法：先计算 \(F_1\) 和 \(F_2\) 的结式公式

对于两个二次多项式 \(F_1 = A_1 x^2 + B_1 x + C_1\) 和 \(F_2 = A_2 x^2 + B_2 x + C_2\)，结式有一个**已知的闭式公式**：
\[
\text{Res} = (A_1 C_2 - A_2 C_1)^2 - (A_1 B_2 - A_2 B_1)(B_1 C_2 - B_2 C_1)
\]

这是 Sylvester 矩阵的简化形式。

### 验证

展开这个公式：
\[
\text{Res} = (A_1 C_2 - A_2 C_1)^2 - (A_1 B_2 - A_2 B_1)(B_1 C_2 - B_2 C_1)
\]

各项都是关于 \(y\) 的多项式，展开后合并同类项即可得到 \(R_4, R_3, R_2, R_1, R_0\)。

---

## 4. 展开计算（高精度）

### 4.1 定义基本量

\[
A_1 = a_1
\]
\[
B_1 = b_1 y + d_1
\]
\[
C_1 = c_1 y^2 + e_1 y + f_1
\]
\[
A_2 = a_2
\]
\[
B_2 = b_2 y + d_2
\]
\[
C_2 = c_2 y^2 + e_2 y + f_2
\]

### 4.2 计算中间量

**\(D = A_1 C_2 - A_2 C_1\)**：
\[
D = a_1(c_2 y^2 + e_2 y + f_2) - a_2(c_1 y^2 + e_1 y + f_1)
\]
\[
= (a_1 c_2 - a_2 c_1) y^2 + (a_1 e_2 - a_2 e_1) y + (a_1 f_2 - a_2 f_1)
\]

**\(E = A_1 B_2 - A_2 B_1\)**：
\[
E = a_1(b_2 y + d_2) - a_2(b_1 y + d_1)
\]
\[
= (a_1 b_2 - a_2 b_1) y + (a_1 d_2 - a_2 d_1)
\]

**\(F = B_1 C_2 - B_2 C_1\)**：
\[
F = (b_1 y + d_1)(c_2 y^2 + e_2 y + f_2) - (b_2 y + d_2)(c_1 y^2 + e_1 y + f_1)
\]

展开 \(F\)：
\[
F = b_1 c_2 y^3 + (b_1 e_2 + d_1 c_2) y^2 + (b_1 f_2 + d_1 e_2) y + d_1 f_2
\]
\[
- [b_2 c_1 y^3 + (b_2 e_1 + d_2 c_1) y^2 + (b_2 f_1 + d_2 e_1) y + d_2 f_1]
\]

合并同类项：
\[
F = (b_1 c_2 - b_2 c_1) y^3 + (b_1 e_2 + d_1 c_2 - b_2 e_1 - d_2 c_1) y^2
\]
\[
+ (b_1 f_2 + d_1 e_2 - b_2 f_1 - d_2 e_1) y + (d_1 f_2 - d_2 f_1)
\]

### 4.3 计算结式

\[
R(y) = D^2 - E \cdot F
\]

展开 \(D^2\)：
\[
D^2 = \Delta_D^2 y^4 + 2\Delta_D \Delta_E y^3 + (\Delta_E^2 + 2\Delta_D \Delta_F) y^2 + 2\Delta_E \Delta_F y + \Delta_F^2
\]

其中：
\[
\Delta_D = a_1 c_2 - a_2 c_1
\]
\[
\Delta_E = a_1 e_2 - a_2 e_1
\]
\[
\Delta_F = a_1 f_2 - a_2 f_1
\]

展开 \(E \cdot F\)：
\[
E \cdot F = (\alpha_E y + \beta_E) \cdot (\alpha_F y^3 + \beta_F y^2 + \gamma_F y + \delta_F)
\]
\[
= \alpha_E \alpha_F y^4 + (\alpha_E \beta_F + \beta_E \alpha_F) y^3 + (\alpha_E \gamma_F + \beta_E \beta_F) y^2 + (\alpha_E \delta_F + \beta_E \gamma_F) y + \beta_E \delta_F
\]

其中：
\[
\alpha_E = a_1 b_2 - a_2 b_1
\]
\[
\beta_E = a_1 d_2 - a_2 d_1
\]
\[
\alpha_F = b_1 c_2 - b_2 c_1
\]
\[
\beta_F = b_1 e_2 + d_1 c_2 - b_2 e_1 - d_2 c_1
\]
\[
\gamma_F = b_1 f_2 + d_1 e_2 - b_2 f_1 - d_2 e_1
\]
\[
\delta_F = d_1 f_2 - d_2 f_1
\]

---

## 5. 最终系数

\[
\boxed{
\begin{aligned}
R_4 &= \Delta_D^2 - \alpha_E \alpha_F \\
R_3 &= 2\Delta_D \Delta_E - (\alpha_E \beta_F + \beta_E \alpha_F) \\
R_2 &= \Delta_E^2 + 2\Delta_D \Delta_F - (\alpha_E \gamma_F + \beta_E \beta_F) \\
R_1 &= 2\Delta_E \Delta_F - (\alpha_E \delta_F + \beta_E \gamma_F) \\
R_0 &= \Delta_F^2 - \beta_E \delta_F
\end{aligned}
}
\]

其中：
\[
\begin{aligned}
\Delta_D &= a_1 c_2 - a_2 c_1 \\
\Delta_E &= a_1 e_2 - a_2 e_1 \\
\Delta_F &= a_1 f_2 - a_2 f_1 \\
\alpha_E &= a_1 b_2 - a_2 b_1 \\
\beta_E &= a_1 d_2 - a_2 d_1 \\
\alpha_F &= b_1 c_2 - b_2 c_1 \\
\beta_F &= b_1 e_2 + d_1 c_2 - b_2 e_1 - d_2 c_1 \\
\gamma_F &= b_1 f_2 + d_1 e_2 - b_2 f_1 - d_2 e_1 \\
\delta_F &= d_1 f_2 - d_2 f_1
\end{aligned}
\]

---

## 6. 代码实现

```javascript
function computeResultantCoefficients(c0, c1) {
    const {a1, b1, c1: C1, d1, e1, f1} = c0;
    const {a2, b2, c2, d2, e2, f2} = c1;
    
    // 计算中间变量
    const ΔD = a1*c2 - a2*C1;
    const ΔE = a1*e2 - a2*e1;
    const ΔF = a1*f2 - a2*f1;
    const αE = a1*b2 - a2*b1;
    const βE = a1*d2 - a2*d1;
    const αF = b1*c2 - b2*C1;
    const βF = b1*e2 + d1*c2 - b2*e1 - d2*C1;
    const γF = b1*f2 + d1*e2 - b2*f1 - d2*e1;
    const δF = d1*f2 - d2*f1;
    
    // 计算 R4, R3, R2, R1, R0
    const R4 = ΔD*ΔD - αE*αF;
    const R3 = 2*ΔD*ΔE - (αE*βF + βE*αF);
    const R2 = ΔE*ΔE + 2*ΔD*ΔF - (αE*γF + βE*βF);
    const R1 = 2*ΔE*ΔF - (αE*δF + βE*γF);
    const R0 = ΔF*ΔF - βE*δF;
    
    return { R4, R3, R2, R1, R0 };
}
```
**是的！** 结式多项式计算的结果中，**所有实交点都对应实根**。

---

## 7. 结式方法与实交点的关系

### 核心结论

对于两条二次曲线：
\[
F_1(x,y) = 0,\quad F_2(x,y) = 0
\]

结式 \(R(y) = \text{Res}_x(F_1, F_2) = 0\) 是关于 \(y\) 的四次方程。

- **每个实根 \(y\)** → 对应一个实交点（或几个）
- **每个复根 \(y\)** → 对应一个复交点

所以，**要得到所有实交点，只需要解出结式的所有实根！**

---

## 8. 为什么？

因为结式 \(R(y)\) 定义为：
> 两个多项式 \(F_1(x,y)\) 和 \(F_2(x,y)\) 在 \(x\) 方向上**有公共根**的条件。

对于给定的 \(y\)：
- 如果 \(R(y) = 0\)，则存在 \(x\) 使得 \(F_1(x,y) = 0\) 和 \(F_2(x,y) = 0\) 同时成立
- 如果 \(R(y)\) 是实数，那么对应的 \(x\) 可能是实数或复数

**关键定理**：
- 如果 \(y\) 是实数且 \(R(y) = 0\)，那么对应的 \(x\) **一定是实数或一对共轭复数**
- 如果 \(x\) 是实数，则 \((x, y)\) 是实交点
- 如果 \(x\) 是共轭复数，则交点在复数域

---

## 9. 如何提取实交点？

### 步骤：

1. **解四次方程** \(R(y) = 0\)，得到 4 个根（实数和复数）

2. **筛选实根**：取所有实根 \(y_i\)

3. **对每个实根 \(y_i\)**：
   - 代入 \(F_1(x, y_i) = 0\)，解出 \(x\)
   - 检查 \(x\) 是否为实数
   - 如果是实数，则 \((x, y_i)\) 是实交点

### 代码示例：

```javascript
function findRealIntersectionsByResultant(c0, c1) {
    // 1. 计算结式系数
    const { R4, R3, R2, R1, R0 } = computeResultantCoefficients(c0, c1);
    
    // 2. 解四次方程 R(y) = R4*y⁴ + R3*y³ + R2*y² + R1*y + R0 = 0
    const roots = math.roots([R4, R3, R2, R1, R0]);
    
    // 3. 筛选实根
    const realYRoots = roots.filter(r => Math.abs(math.im(r)) < 1e-10)
                            .map(r => math.re(r));
    
    // 4. 对每个实根 y，求对应的 x
    const intersections = [];
    for (const y of realYRoots) {
        // 代入 F1(x, y) = 0，得到关于 x 的二次方程
        // A1*x² + B1*x + C1 = 0
        const A1 = a1;
        const B1 = b1 * y + d1;
        const C1 = c1 * y * y + e1 * y + f1;
        
        const xRoots = solveQuadratic(A1, B1, C1);
        for (const x of xRoots) {
            if (Math.abs(math.im(x)) < 1e-10) {
                intersections.push({
                    x: math.re(x),
                    y: y,
                    type: 'real'
                });
            } else {
                intersections.push({
                    x: math.re(x),
                    y: y,
                    type: 'complex'
                });
            }
        }
    }
    
    return intersections;
}
```


---

# 六、曲线交点的矩阵束计算方法

## 1. 问题定义

给定两条二次曲线：
\[
F_1(x,y) = a_1x^2 + b_1xy + c_1y^2 + d_1x + e_1y + f_1 = 0
\]
\[
F_2(x,y) = a_2x^2 + b_2xy + c_2y^2 + d_2x + e_2y + f_2 = 0
\]

求它们的交点（实数或复数）。

---

## 2. 核心思想

两条二次曲线的交点，也是它们**线性组合**形成的退化二次曲线的交点。

考虑曲线束：
\[
F_\lambda = F_1 + \lambda F_2 = 0
\]

对于特定的 \(\lambda\)，\(F_\lambda\) 可能**退化**（成为一对直线）。这些退化曲线包含原曲线的所有交点。

---

## 3. 算法步骤

### 步骤 1：转换为矩阵形式

在齐次坐标 \(\mathbf{x} = [x, y, 1]^T\) 下，每条二次曲线对应一个对称矩阵：
\[
A_i = \begin{bmatrix}
a_i & b_i/2 & d_i/2 \\
b_i/2 & c_i & e_i/2 \\
d_i/2 & e_i/2 & f_i
\end{bmatrix}
\]

所以：
\[
F_i(\mathbf{x}) = \mathbf{x}^T A_i \mathbf{x} = 0
\]

---

### 步骤 2：构造矩阵束

\[
B(\lambda) = A_1 + \lambda A_2
\]

当 \(\det(B(\lambda)) = 0\) 时，\(B(\lambda)\) 是奇异的，对应的二次曲线退化为两条直线。

---

### 步骤 3：求解特征方程

\[
\det(A_1 + \lambda A_2) = C_3\lambda^3 + C_2\lambda^2 + C_1\lambda + C_0 = 0
\]

这个三次方程称为**特征方程**，其根 \(\lambda_i\) 对应退化二次曲线。

**系数公式**：

- \(C_3 = \det(A_2)\)
- \(C_2 = (c_2 f_2 - e_2^2/4) a_1 + (a_2 f_2 - d_2^2/4) c_1 + (a_2 c_2 - b_2^2/4) f_1 + \frac{1}{2}(b_2 f_2 - d_2 e_2/2) b_1 + \frac{1}{2}(b_2 e_2/2 - c_2 d_2) d_1 + \frac{1}{2}(a_2 e_2 - b_2 d_2/2) e_1\)
- \(C_1 = (c_1 f_1 - e_1^2/4) a_2 + (a_1 f_1 - d_1^2/4) c_2 + (a_1 c_1 - b_1^2/4) f_2 + \frac{1}{2}(b_1 f_1 - d_1 e_1/2) b_2 + \frac{1}{2}(b_1 e_1/2 - c_1 d_1) d_2 + \frac{1}{2}(a_1 e_1 - b_1 d_1/2) e_2\)
- \(C_0 = \det(A_1)\)

---

### 步骤 4：解三次方程

\[
C_3\lambda^3 + C_2\lambda^2 + C_1\lambda + C_0 = 0
\]

得到三个根（可能实数或复数）：
\[
\lambda_1, \lambda_2, \lambda_3
\]

---

### 步骤 5：对每个实根 \(\lambda_i\)，构造退化矩阵

\[
B = A_1 + \lambda_i A_2
\]

---

### 步骤 6：分解退化矩阵为两条直线

#### 方法 A：特征分解（对称矩阵）

1. 对 \(B\) 做特征分解：\(B = U \Sigma U^T\)
2. 取两个非零特征值 \(\sigma_1, \sigma_2\) 对应的特征向量 \(\mathbf{u}_1, \mathbf{u}_2\)
3. 构造直线：
   \[
   \mathbf{p} = \sqrt{|\sigma_1|} \mathbf{u}_1,\quad \mathbf{q} = \sqrt{|\sigma_2|} \mathbf{u}_2
   \]
   \[
   \mathbf{l}_1 = \mathbf{p} + \mathbf{q},\quad \mathbf{l}_2 = \mathbf{p} - \mathbf{q}
   \]

#### 方法 B：SVD 分解（更稳定）

1. 对 \(B\) 做 SVD：\(B = U \Sigma V^T\)
2. 取非零奇异值对应的右奇异向量
3. 构造直线（同上）

---

### 步骤 7：求直线与曲线的交点

对每条直线 \(\mathbf{l} = [A, B, C]^T\)，解：
\[
Ax + By + C = 0
\]
\[
F_1(x,y) = 0
\]

得到交点。

---

### 步骤 8：合并去重

将所有交点合并，去重后得到最终结果。

---

## 4. 特殊情况处理

### 情况 1：只有一个实根

- 说明另外两个交点是复数
- 或者两条曲线相切（有重根）

### 情况 2：B 矩阵秩为 1

- 退化二次曲线是**双重直线**
- 无法分解为两条不同的直线
- 需要用零空间向量法或相切法求交点

### 情况 3：复共轭直线对

- 两个非零特征值同号
- 直线是复共轭的
- 用零空间向量法提取实交点

---

## 5. 完整流程图

```
开始
  ↓
输入两条曲线 A₁, A₂
  ↓
计算特征方程系数 C₀, C₁, C₂, C₃
  ↓
解三次方程 C₃λ³ + C₂λ² + C₁λ + C₀ = 0
  ↓
对每个实根 λᵢ：
  ↓
构造 B = A₁ + λᵢA₂
  ↓
B 的秩？
  ├── 秩 = 2 → 分解为两条直线
  │              ↓
  │         直线与曲线求交
  │              ↓
  │         收集交点
  │
  └── 秩 = 1 → 零空间向量法
                 ↓
            提取交点
  ↓
合并去重
  ↓
输出交点
```

---

## 6. 数值注意事项

1. **使用高精度**（BigNumber）避免数值误差
2. **判断零特征值**时使用容差（如 1e-10）
3. **SVD 比特征分解更稳定**，推荐使用
4. **验证交点**：代入两条曲线检查是否为零

# 七、二次曲面交线的精确表示
## 核心思想概述
二次曲面本身可以由一个精确的参数⽅程或隐函数⽅程表示，但是两个二次曲面的交线却没有一个明确的参数方程或隐函数方程描述。
理论上我们可以使用两个二次曲面方程联立的方程组作为曲面交线的精确表达，但是这正以方程组的形式描述的曲线在进行曲线造型
的时候非常的不方便，所以我们希望获得一种以参数方程的形式得到的曲线描述方法。
假设有两个曲面其中
第一个用参数方程表示为:
$$
S1=\begin{cases}
  x = x(u,v) \\
  y = y(u,v) \\
  z = z(u,v) \\
\end{cases}
$$
第二个用隐函数方程表示为：$ S2 = (x,y,z) = 0 $
将第一个曲面的参数方程带入第二个曲面的隐函数方程则我们可以得到一个在S1的参数空间内定义的S1和S2的交线方程：
$$C=C(x(u,v),y(u,v),(u,v))$$
理论上C就应该是同时满足S1和S2两个曲面定义的交线，只不过C是⼀个在uv空间的隐函数⽅程，依然不太适合建模细分等计算。所以我们考虑在去这个曲线上的一段时可以在指定的a、b(uv空间)点间画一条直线，然后在期间获得若干个插值点p,由p点开始向C做逼近获得对应在C上的点q，然后将这写q点与a、b组成一个序列：[a,q1,q2..,b],用这个序列拟合成一条在S1的uv空间下的nurbs曲线c，则c是C在S1的UV空间下的近似曲线，其起点终点和中间的拟合点都是精确的，但是其他的点并不保证在C上。当我们将c作为一条精确曲线使用时，需要先在c上按照一般的nurbs那样获得一个采样点，然后再有这个采样点出发向C进行逼近后的一个精确的对应解，这样我们就得到了一条参数曲线c，同时它计算精度由C保证:即一个参数曲线加一个隐函数方程共同描述这个曲线，来满足我们的要求。


