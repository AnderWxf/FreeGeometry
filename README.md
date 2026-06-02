# FreeGeometry
Brep,Geometry


Install:
npm install -save typescrpt

npm install -save three

npm install -save webpack

npm install -save antd


# 核心数学方程

## 一、二次曲线的一般方程系数，计算二次曲线交点。
这是一个非常经典且富有深度的问题。你提到的“包含平移、旋转、不等比缩放、反射的矩阵”，在数学上通常指的是**仿射变换**。

要将一个已知的标准二次曲线通过这样的变换，计算出新的一般方程系数，核心是理解**坐标变换**与**系数变换**的关系。

以下是完整的数学推导和计算步骤。


### 1. 问题建模

假设我们有一个标准二次曲线，通常写成矩阵形式：
```math
\mathbf{x}^T \mathbf{Q} \mathbf{x} = 0
```

其中 $\mathbf{x} = \begin{bmatrix} x & y & 1 \end{bmatrix}$ 是齐次坐标，$\mathbf{Q}$ 是一个 $3 \times 3$ 的对称矩阵，包含了二次项、一次项和常数项的系数。

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

现在，我们想对这个曲线上的每个点施加一个变换矩阵 $\mathbf{T}$（$3 \times 3$ 的仿射变换矩阵，包含平移、旋转、缩放、反射）。

设原曲线上的点为 $\mathbf{x}_{old}$，变换后的点为 $\mathbf{x}_{new}$，则有：
```math
\mathbf{x}_{old} = \mathbf{T}^{-1} \mathbf{x}_{new}
```

### 2. 核心推导：系数矩阵的变换规律

将 $\mathbf{x}_{old} = \mathbf{T}^{-1} \mathbf{x}_{new}$ 代入原方程：
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

-   $\mathbf{Q}_{old}$：原曲线的系数矩阵（已知）。
-   $\mathbf{T}$：你定义的变换矩阵（已知，$3 \times 3$ 仿射矩阵）。
-   $\mathbf{T}^{-T}$：先求逆，再转置（或者先转置再求逆，结果一样）。
-   $\mathbf{Q}_{new}$：新曲线的系数矩阵。

### 3. 计算步骤

假设你有一个变换 $\mathbf{T}$，将旧坐标 $(x_{old}, y_{old})$ 映射到新坐标 $(x_{new}, y_{new})$：

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

其中 $\begin{bmatrix} a & b \\ c & d \end{bmatrix}$ 部分包含了**旋转、不等比缩放、反射**，$(t_x, t_y)$ 是**平移**。

#### 步骤 1：写出原曲线矩阵 $\mathbf{Q}_{old}$
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
*注意：矩阵中的系数对应关系是，当展开 $\mathbf{x}^T\mathbf{Q}\mathbf{x}$ 时，二次项系数正确出现。*

#### 步骤 2：求变换矩阵的逆 $\mathbf{T}^{-1}$
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

#### 步骤 3：计算 $\mathbf{Q}_{new} = \mathbf{T}^{-T} \mathbf{Q}_{old} \mathbf{T}^{-1}$
这是一个 $3 \times 3$ 矩阵乘法。结果 $\mathbf{Q}_{new}$ 将是一个对称矩阵。

#### 步骤 4：提取新系数
根据 $\mathbf{Q}_{new}$ 的对应位置提取新方程的系数：

-   $A_{new} = \mathbf{Q}_{new}[1,1]$
-   $B_{new} = 2 \times \mathbf{Q}_{new}[1,2]$ （因为矩阵的 (1,2) 项存储的是 $B/2$）
-   $C_{new} = \mathbf{Q}_{new}[2,2]$
-   $D_{new} = 2 \times \mathbf{Q}_{new}[1,3]$
-   $E_{new} = 2 \times \mathbf{Q}_{new}[2,3]$
-   $F_{new} = \mathbf{Q}_{new}[3,3]$


### 总结
1.  **使用齐次坐标**和 $3\times 3$ 矩阵 $\mathbf{Q}$ 来表示二次曲线。
2.  **变换公式**：$\mathbf{Q}_{new} = \mathbf{T}^{-T} \mathbf{Q}_{old} \mathbf{T}^{-1}$。
3.  无论变换多么复杂（平移、旋转、不等比缩放、反射），这个公式都能直接给出新的一般方程系数。


## 二、二次曲线的格林公式积分，用于计算有向面积，判定曲线绕向。

### 概述
计算闭合曲线的有向面积。可以获得面积的大小，同时根据面积的符号判断轮廓的绕向，面积 > 0 时正向，面积 < 0 时反向。

### 核心公式

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

其中，$ \mathbf{M} = \begin{pmatrix} a & b \\ c & d \end{pmatrix} $，行列式 $ \Delta = ad - bc $。

**分段计算公式：**
```math
\boxed{I_{\text{world}} = \Delta \cdot I_{\text{local}} + \frac{1}{2} \left( T_x \Delta Y - T_y \Delta X \right)}
```


在**标准方程**（中心/顶点在原点，无平移，无旋转）下，圆锥曲线的有向面积积分具有简洁的解析形式。

有向面积贡献公式：

```math
I = \frac{1}{2} \int_{t_1}^{t_2} \left( x \frac{dy}{dt} - y \frac{dx}{dt} \right) dt
```


### 有向面积积分结果

| 曲线 | 参数方程 | 积分结果 $I$ |
| --- | --- | --- |
| 直线 | $x = x_1 + (x_2-x_1)t,\ y = y_1 + (y_2-y_1)t$ | $\frac{1}{2}(x_1y_2 - x_2y_1)$ |
| 圆 | $(r\cos\theta,\ r\sin\theta)$ | $\frac{1}{2}r^2(\theta_2 - \theta_1)$ |
| 椭圆 | $(a\cos\theta,\ b\sin\theta)$ | $\frac{1}{2}ab(\theta_2 - \theta_1)$ |
| 抛物线 $y^2=4px$ | $(pt^2,\ 2pt)$ | $-\frac{p^2}{3}(t_2^3 - t_1^3)$ |
| 抛物线 $x^2=4py$ | $(2pt,\ pt^2)$ | $\frac{p^2}{3}(t_2^3 - t_1^3)$ |
| 双曲线（双曲函数） | $(a\cosh u,\ b\sinh u)$ | $\frac{ab}{2}(u_2 - u_1)$ |
| 双曲线（正割/正切） | $(a\sec\phi,\ b\tan\phi)$ | $\frac{ab}{2} \ln\|\frac{\sec\phi_2 + \tan\phi_2}{\sec\phi_1 + \tan\phi_1} \|$ |
